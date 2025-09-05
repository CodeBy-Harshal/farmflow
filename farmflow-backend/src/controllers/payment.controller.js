const pool = require("../config/db");
const { buildUpiUri, generateUpiQrDataUrl } = require("../utils/upi");
const { notifyUser } = require("../utils/notification");

const COMMISSION_PCT = Number(process.env.PLATFORM_COMMISSION_PCT || 5);
const PLATFORM_VPA = process.env.PLATFORM_UPI_VPA || "demo@upi";
const PLATFORM_NAME = process.env.PLATFORM_UPI_NAME || "FarmFlow";
const PLATFORM_ADMIN_USER_ID = Number(process.env.PLATFORM_ADMIN_USER_ID || 1);

// Helpers
async function getOrderBasic(orderId) {
  const [[row]] = await pool.query(
    `SELECT id, order_number, buyer_id, seller_id, total_amount, status
     FROM orders WHERE id=?`, [orderId]
  );
  return row;
}

async function ensureWallet(conn, userId) {
  const [[existing]] = await conn.query(`SELECT id FROM wallets WHERE user_id=?`, [userId]);
  if (existing) return existing.id;
  const [res] = await conn.query(
    `INSERT INTO wallets (user_id, currency, balance) VALUES (?, 'INR', 0.00)`,
    [userId]
  );
  return res.insertId;
}

async function addWalletTxn(conn, walletId, refType, refId, amount, description) {
  await conn.query(
    `INSERT INTO wallet_transactions (wallet_id, reference_type, reference_id, amount, description)
     VALUES (?, ?, ?, ?, ?)`,
    [walletId, refType, refId, amount, description || null]
  );
}

// Buyer initiates UPI payment
exports.initiateUpiPayment = async (req, res) => {
  try {
    const { order_id } = req.body;
    if (!order_id) return res.status(400).json({ success: false, message: "order_id is required" });

    const order = await getOrderBasic(order_id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Prevent duplicate successful payments
    const [[paid]] = await pool.query(
      `SELECT id FROM payments WHERE order_id=? AND status='SUCCESS' LIMIT 1`, [order_id]
    );
    if (paid) {
      return res.status(409).json({ success: false, message: "Order already paid" });
    }

    const amount = Number(order.total_amount || 0);
    if (amount <= 0) return res.status(400).json({ success: false, message: "Invalid order amount" });

    const commissionAmount = +(amount * (COMMISSION_PCT / 100)).toFixed(2);
    const payoutAmount = +(amount - commissionAmount).toFixed(2);

    // Create payments row
    const providerTxnId = `UPILINK-${Date.now()}-${order_id}`;
    const [payRes] = await pool.query(
      `INSERT INTO payments
       (order_id, buyer_id, seller_id, provider, provider_txn_id, amount,
        platform_commission_pct, platform_commission_amount, payout_amount, status)
       VALUES (?, ?, ?, 'OTHER', ?, ?, ?, ?, ?, 'INITIATED')`,
      [order_id, order.buyer_id, order.seller_id, providerTxnId, amount,
       COMMISSION_PCT, commissionAmount, payoutAmount]
    );
    const paymentId = payRes.insertId;

    // Build UPI link + QR
    const note = `FarmFlow ${order.order_number}`;
    const upiUri = buildUpiUri({ pa: PLATFORM_VPA, pn: PLATFORM_NAME, am: amount, tn: note });
    const qrDataUrl = await generateUpiQrDataUrl(upiUri);

    return res.status(201).json({
      success: true,
      data: {
        paymentId,
        orderNumber: order.order_number,
        amount,
        upiUri,
        qrDataUrl
      }
    });
  } catch (err) {
    console.error("❌ initiateUpiPayment:", err.message);
    return res.status(500).json({ success: false, message: "Server error initiating payment" });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [[p]] = await pool.query(
      `SELECT id, order_id, buyer_id, seller_id, provider, provider_txn_id, amount,
              platform_commission_pct, platform_commission_amount, payout_amount,
              status, paid_at, created_at, updated_at
       FROM payments WHERE id=?`, [id]
    );
    if (!p) return res.status(404).json({ success: false, message: "Payment not found" });
    return res.json({ success: true, data: p });
  } catch (err) {
    console.error("❌ getPaymentById:", err.message);
    return res.status(500).json({ success: false, message: "Server error fetching payment" });
  }
};

// Confirm real payment (manual after buyer clicks "I Have Paid")
exports.confirmPayment = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;

    const [[pay]] = await conn.query(`SELECT * FROM payments WHERE id=?`, [id]);
    if (!pay) {
      conn.release();
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    if (pay.status === "SUCCESS") {
      conn.release();
      return res.status(409).json({ success: false, message: "Already confirmed" });
    }

    await conn.beginTransaction();

    // 1) Mark payment successful
    await conn.query(
      `UPDATE payments SET status='SUCCESS', paid_at=NOW(), updated_at=NOW() WHERE id=?`,
      [id]
    );

    // 2) Wallet credit: Seller
    const sellerWalletId = await ensureWallet(conn, pay.seller_id);
    await conn.query(`UPDATE wallets SET balance = balance + ? WHERE id=?`,
      [pay.payout_amount, sellerWalletId]);
    await addWalletTxn(conn, sellerWalletId, "PAYMENT_PAYOUT", pay.id, pay.payout_amount,
      `Payout for order #${pay.order_id}`);

    // 3) Wallet credit: Platform commission
    if (PLATFORM_ADMIN_USER_ID) {
      const adminWalletId = await ensureWallet(conn, PLATFORM_ADMIN_USER_ID);
      await conn.query(`UPDATE wallets SET balance = balance + ? WHERE id=?`,
        [pay.platform_commission_amount, adminWalletId]);
      await addWalletTxn(conn, adminWalletId, "ADJUSTMENT", pay.id, pay.platform_commission_amount,
        `Commission for order #${pay.order_id}`);
    }

    // 4) Update order status
    await conn.query(
      `UPDATE orders SET status='ACCEPTED', updated_at=NOW() WHERE id=?`,
      [pay.order_id]
    );
    await conn.query(
      `INSERT INTO order_status_history (order_id, status) VALUES (?, 'ACCEPTED')`,
      [pay.order_id]
    );

    // 5) Notify buyer & seller
    const [orders] = await conn.query(`SELECT * FROM orders WHERE id=?`, [pay.order_id]);
    const order = orders[0];
    await notifyUser(order.seller_id, "ORDER_UPDATE", `💰 Payment received for order ${order.order_number}`);
    await notifyUser(order.buyer_id, "ORDER_UPDATE", `✅ Payment confirmed for order ${order.order_number}`);

    await conn.commit();
    return res.json({ success: true, message: "Payment confirmed, wallets updated, order accepted" });
  } catch (err) {
    await (conn?.rollback?.());
    console.error("❌ confirmPayment:", err.message);
    return res.status(500).json({ success: false, message: "Server error confirming payment" });
  } finally {
    conn.release();
  }
};

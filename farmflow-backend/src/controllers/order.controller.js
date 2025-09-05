const pool = require("../config/db");
const { notifyUser } = require("../utils/notification");

// Allowed forward-only transitions
const ORDER_STATUS_FLOW = {
  PENDING: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

// Place a new order
exports.placeOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { product_id, quantity, notes } = req.body;
    const buyer_id = req.user.id;

    const [products] = await conn.query(
      `SELECT id, seller_id, name, price, quantity_available, status, unit_id 
       FROM products WHERE id = ?`,
      [product_id]
    );

    if (!products.length || products[0].status !== "ACTIVE") {
      return res.status(404).json({ success: false, message: "Product not found or not active" });
    }

    const product = products[0];
    if (product.quantity_available < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock available" });
    }

    const subtotal = product.price * quantity;
    const shipping = 0.0;
    const discount = 0.0;
    const total = subtotal + shipping - discount;

    await conn.beginTransaction();

    const [lastOrder] = await conn.query("SELECT MAX(id) as maxId FROM orders");
    const nextId = (lastOrder[0].maxId || 0) + 1;
    const orderNumber = `ORD-${10000 + nextId}`;

    const [orderResult] = await conn.query(
      `INSERT INTO orders 
       (buyer_id, seller_id, order_number, status, subtotal_amount, shipping_amount, discount_amount, total_amount, notes) 
       VALUES (?, ?, ?, 'PENDING', ?, ?, ?, ?, ?)`,
      [buyer_id, product.seller_id, orderNumber, subtotal, shipping, discount, total, notes || null]
    );

    const orderId = orderResult.insertId;

    await conn.query(
      `INSERT INTO order_items 
       (order_id, product_id, product_name_snapshot, unit_id, unit_price, quantity, line_total)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, product.id, product.name, product.unit_id, product.price, quantity, subtotal]
    );

    await conn.query(
      "UPDATE products SET quantity_available = quantity_available - ? WHERE id = ?",
      [quantity, product_id]
    );

    await conn.query(
      "INSERT INTO order_status_history (order_id, status) VALUES (?, 'PENDING')",
      [orderId]
    );

    await conn.commit();

    await notifyUser(product.seller_id, "ORDER_UPDATE", `You received a new order ${orderNumber}`);
    await notifyUser(buyer_id, "ORDER_UPDATE", `Your order ${orderNumber} has been placed successfully`);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: { orderId, orderNumber, totalAmount: total },
    });
  } catch (err) {
    await conn.rollback();
    console.error("❌ placeOrder:", err.sqlMessage || err.message);
    res.status(500).json({ success: false, message: "Server error placing order" });
  } finally {
    conn.release();
  }
};

// Get logged-in user's orders
exports.getMyOrders = async (req, res) => {
  try {
    let query = `
      SELECT o.id, o.order_number, o.status, o.subtotal_amount, o.total_amount, o.created_at,
             oi.product_name_snapshot AS product, oi.unit_price, oi.quantity, oi.line_total,
             b.name AS buyer, s.name AS seller
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN users b ON o.buyer_id = b.id
      JOIN users s ON o.seller_id = s.id
    `;
    let params = [];

    if (req.user.role === "BUYER") {
      query += " WHERE o.buyer_id=?";
      params.push(req.user.id);
    } else if (req.user.role === "FARMER") {
      query += " WHERE o.seller_id=?";
      params.push(req.user.id);
    }

    query += " ORDER BY o.created_at DESC";

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ getMyOrders:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching orders" });
  }
};

// Get single order (with items + history)
exports.getOrderById = async (req, res) => {
  try {
    const [[order]] = await pool.query(
      `SELECT o.id, o.order_number, o.status, o.subtotal_amount, o.shipping_amount, 
              o.discount_amount, o.total_amount, o.notes, o.created_at,
              o.buyer_id, o.seller_id, b.name AS buyer, s.name AS seller
       FROM orders o
       JOIN users b ON o.buyer_id = b.id
       JOIN users s ON o.seller_id = s.id
       WHERE o.id=?`,
      [req.params.id]
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if ((req.user.role === "BUYER" && order.buyer_id !== req.user.id) ||
        (req.user.role === "FARMER" && order.seller_id !== req.user.id)) {
      return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }

    const [items] = await pool.query(
      `SELECT product_name_snapshot AS product, unit_price, quantity, line_total
       FROM order_items WHERE order_id=?`, [req.params.id]
    );

    const [history] = await pool.query(
      `SELECT status, changed_at FROM order_status_history
       WHERE order_id=? ORDER BY changed_at ASC`, [req.params.id]
    );

    res.json({ success: true, data: { ...order, items, history } });
  } catch (err) {
    console.error("❌ getOrderById:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching order" });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status || !Object.keys(ORDER_STATUS_FLOW).includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status provided" });
    }

    await conn.beginTransaction();

    const [orders] = await conn.query("SELECT * FROM orders WHERE id=?", [id]);
    if (!orders.length) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];

    if (req.user.role === "FARMER" && order.seller_id !== userId) {
      await conn.rollback();
      return res.status(403).json({ success: false, message: "Not authorized to update this order" });
    }

    if (req.user.role === "FARMER") {
      const allowedNext = ORDER_STATUS_FLOW[order.status] || [];
      if (!allowedNext.includes(status)) {
        await conn.rollback();
        return res.status(400).json({ success: false, message: `Invalid transition from ${order.status} to ${status}` });
      }
    }

    await conn.query("UPDATE orders SET status=?, updated_at=NOW() WHERE id=?", [status, id]);
    await conn.query("INSERT INTO order_status_history (order_id, status) VALUES (?, ?)", [id, status]);

    let notifyMsg = {
      ACCEPTED: `Your order ${order.order_number} has been accepted`,
      SHIPPED: `Your order ${order.order_number} has been shipped`,
      DELIVERED: `Your order ${order.order_number} has been delivered`,
      CANCELLED: `Your order ${order.order_number} has been cancelled`
    }[status];

    if (notifyMsg) {
      await notifyUser(order.buyer_id, "ORDER_UPDATE", notifyMsg);
    }

    await conn.commit();
    res.json({ success: true, message: `Order updated to ${status}` });
  } catch (err) {
    await conn.rollback();
    console.error("❌ updateOrderStatus:", err.message);
    res.status(500).json({ success: false, message: "Server error updating order" });
  } finally {
    conn.release();
  }
};

// Cancel order (Buyer only) → restores stock
exports.cancelOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orders] = await conn.query("SELECT * FROM orders WHERE id=?", [req.params.id]);
    if (!orders.length) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];
    if (order.buyer_id !== req.user.id) {
      await conn.rollback();
      return res.status(403).json({ success: false, message: "Not authorized to cancel this order" });
    }

    if (order.status === "DELIVERED") {
      await conn.rollback();
      return res.status(400).json({ success: false, message: "Delivered orders cannot be cancelled" });
    }

    await conn.query("UPDATE orders SET status='CANCELLED', updated_at=NOW() WHERE id=?", [req.params.id]);
    await conn.query("INSERT INTO order_status_history (order_id, status) VALUES (?, 'CANCELLED')", [req.params.id]);

    // restore stock
    const [items] = await conn.query("SELECT product_id, quantity FROM order_items WHERE order_id=?", [req.params.id]);
    for (let item of items) {
      await conn.query("UPDATE products SET quantity_available = quantity_available + ? WHERE id=?", [item.quantity, item.product_id]);
    }

    await notifyUser(order.seller_id, "ORDER_UPDATE", `Buyer cancelled order ${order.order_number}`);
    await notifyUser(order.buyer_id, "ORDER_UPDATE", `You cancelled order ${order.order_number}`);

    await conn.commit();
    res.json({ success: true, message: "Order cancelled" });
  } catch (err) {
    await conn.rollback();
    console.error("❌ cancelOrder:", err.message);
    res.status(500).json({ success: false, message: "Server error cancelling order" });
  } finally {
    conn.release();
  }
};

// Delete cancelled order → cleans up related tables
exports.deleteOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orders] = await conn.query("SELECT * FROM orders WHERE id=?", [req.params.id]);
    if (!orders.length) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = orders[0];
    if (order.status !== "CANCELLED") {
      await conn.rollback();
      return res.status(400).json({ success: false, message: "Only cancelled orders can be deleted" });
    }

    if (req.user.role !== "ADMIN" && req.user.id !== order.seller_id) {
      await conn.rollback();
      return res.status(403).json({ success: false, message: "Not authorized to delete this order" });
    }

    await conn.query("DELETE FROM order_items WHERE order_id=?", [req.params.id]);
    await conn.query("DELETE FROM order_status_history WHERE order_id=?", [req.params.id]);
    await conn.query("DELETE FROM orders WHERE id=?", [req.params.id]);

    await notifyUser(order.seller_id, "ORDER_UPDATE", `Order ${order.order_number} was permanently deleted`);

    await conn.commit();
    res.json({ success: true, message: "Order permanently deleted" });
  } catch (err) {
    await conn.rollback();
    console.error("❌ deleteOrder:", err.message);
    res.status(500).json({ success: false, message: "Server error deleting order" });
  } finally {
    conn.release();
  }
};

// Farmer sales
exports.getMySales = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.id, o.order_number, o.status, o.subtotal_amount, o.total_amount, o.created_at,
              oi.product_name_snapshot AS product, oi.unit_price, oi.quantity, oi.line_total,
              b.name AS buyer
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN users b ON o.buyer_id = b.id
       WHERE o.seller_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ getMySales:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching sales" });
  }
};

// Admin: all orders
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.id, o.order_number, o.status, o.subtotal_amount, o.total_amount, o.created_at,
              oi.product_name_snapshot AS product, oi.unit_price, oi.quantity, oi.line_total,
              b.name AS buyer, s.name AS seller
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN users b ON o.buyer_id = b.id
       JOIN users s ON o.seller_id = s.id
       ORDER BY o.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ getAllOrders:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching all orders" });
  }
};

// Order stats
exports.getOrderStats = async (req, res) => {
  try {
    let query = "SELECT status, COUNT(*) as count FROM orders";
    let params = [];

    if (req.user.role === "BUYER") {
      query += " WHERE buyer_id=?";
      params.push(req.user.id);
    } else if (req.user.role === "FARMER") {
      query += " WHERE seller_id=?";
      params.push(req.user.id);
    }

    query += " GROUP BY status";

    const [rows] = await pool.query(query, params);
    const stats = rows.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {});

    res.json({ success: true, data: stats });
  } catch (err) {
    console.error("❌ getOrderStats:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching order stats" });
  }
};

// Get next statuses
exports.getNextStatuses = async (req, res) => {
  try {
    const [orders] = await pool.query("SELECT status FROM orders WHERE id=?", [req.params.id]);
    if (!orders.length) return res.status(404).json({ success: false, message: "Order not found" });

    const current = orders[0].status;
    const next = ORDER_STATUS_FLOW[current] || [];
    res.json({ success: true, data: next });
  } catch (err) {
    console.error("❌ getNextStatuses:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching next statuses" });
  }
};

// Get all statuses (Admin dropdown)
exports.getAllStatuses = async (req, res) => {
  try {
    res.json({ success: true, data: ORDER_STATUS_FLOW });
  } catch (err) {
    console.error("❌ getAllStatuses:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching all statuses" });
  }
};

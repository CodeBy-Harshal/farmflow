const pool = require("../config/db");

// Buyer Dashboard
exports.getBuyerDashboard = async (req, res) => {
  try {
    const buyerId = req.user.id;

    // Summary
    const [[summary]] = await pool.query(
      `
      SELECT
        (SELECT COUNT(*) FROM orders WHERE buyer_id=?) AS total_orders,
        (SELECT COUNT(*) FROM orders WHERE buyer_id=? AND status='DELIVERED') AS completed_orders,
        (SELECT IFNULL(SUM(total_amount),0) FROM orders WHERE buyer_id=? AND status='DELIVERED') AS total_spent
      `,
      [buyerId, buyerId, buyerId]
    );

    // Order breakdown
    const [orderStats] = await pool.query(
      `
      SELECT status, COUNT(*) as count
      FROM orders
      WHERE buyer_id=?
      GROUP BY status
      `,
      [buyerId]
    );
    const orderBreakdown = orderStats.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {});

    // Latest 5 orders
    const [latestOrders] = await pool.query(
      `
      SELECT o.id, o.order_number, o.status, o.total_amount, o.created_at,
             oi.product_name_snapshot AS product,
             s.name AS seller,
             o.notes
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN users s ON o.seller_id = s.id
      WHERE o.buyer_id=?
      ORDER BY o.created_at DESC
      LIMIT 5
      `,
      [buyerId]
    );

    res.json({
      summary,
      orderBreakdown,
      latestOrders,
    });
  } catch (err) {
    console.error("❌ getBuyerDashboard:", err.sqlMessage || err.message);
    res.status(500).json({ message: "Server error fetching buyer dashboard" });
  }
};

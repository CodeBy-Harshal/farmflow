const pool = require("../config/db");

// Admin Dashboard (users, products, orders, revenue, breakdowns)
exports.getDashboardStats = async (req, res) => {
  try {
    // Global counts (users, products, orders, revenue)
    const [[summary]] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM products) AS products,
        (SELECT COUNT(*) FROM orders) AS orders,
        (SELECT IFNULL(SUM(total_amount),0) FROM orders WHERE status='COMPLETED') AS revenue
    `);

    // Products by status
    const [productStats] = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM products 
      GROUP BY status
    `);
    const productBreakdown = productStats.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {});

    // Orders by status
    const [orderStats] = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `);
    const orderBreakdown = orderStats.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {});

    // Latest 5 users
    const [latestUsers] = await pool.query(`
      SELECT id, name, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // Latest 5 orders
    const [latestOrders] = await pool.query(`
      SELECT o.id, o.order_number, o.status, o.total_amount,
             b.name AS buyer, s.name AS seller, o.created_at
      FROM orders o
      JOIN users b ON o.buyer_id = b.id
      JOIN users s ON o.seller_id = s.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    res.json({
      summary,
      productBreakdown,
      orderBreakdown,
      latestUsers,
      latestOrders,
    });
  } catch (err) {
    console.error("❌ getDashboardStats:", err.message);
    res.status(500).json({ message: "Server error fetching dashboard stats" });
  }
};

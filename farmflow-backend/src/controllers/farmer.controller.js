const pool = require("../config/db");

// Farmer Dashboard (own stats, sales, products, revenue)
exports.getFarmerDashboard = async (req, res) => {
  try {
    const farmerId = req.user.id;

    // Summary: products, sales (orders), revenue
    const [[summary]] = await pool.query(
      `
      SELECT
        (SELECT COUNT(*) FROM products WHERE seller_id=?) AS products,
        (SELECT COUNT(*) FROM orders WHERE seller_id=?) AS sales,
        (SELECT IFNULL(SUM(total_amount),0) 
         FROM orders 
         WHERE seller_id=? AND status IN ('DELIVERED','COMPLETED')) AS revenue
      `,
      [farmerId, farmerId, farmerId]
    );

    // Orders breakdown by status
    const [orderStats] = await pool.query(
      `
      SELECT status, COUNT(*) as count
      FROM orders
      WHERE seller_id=?
      GROUP BY status
      `,
      [farmerId]
    );
    const orderBreakdown = orderStats.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {});

    // Products breakdown by status
    const [productStats] = await pool.query(
      `
      SELECT status, COUNT(*) as count
      FROM products
      WHERE seller_id=?
      GROUP BY status
      `,
      [farmerId]
    );
    const productBreakdown = productStats.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {});

    // Latest 5 products
    const [latestProducts] = await pool.query(
      `
      SELECT id, name, price, status, created_at
      FROM products
      WHERE seller_id=?
      ORDER BY created_at DESC
      LIMIT 5
      `,
      [farmerId]
    );

    // Latest 5 sales
    const [latestSales] = await pool.query(
      `
      SELECT o.id, o.order_number, o.status, o.total_amount,
             u.name AS buyer, o.created_at
      FROM orders o
      JOIN users u ON o.buyer_id = u.id
      WHERE o.seller_id=?
      ORDER BY o.created_at DESC
      LIMIT 5
      `,
      [farmerId]
    );

    res.json({
      summary,
      orderBreakdown,
      productBreakdown,
      latestProducts,
      latestSales,
    });
  } catch (err) {
    console.error("❌ getFarmerDashboard:", err.message);
    res.status(500).json({ message: "Server error fetching farmer dashboard" });
  }
};

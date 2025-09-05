const pool = require("../config/db");
const { notifyUser } = require("../utils/notification");

// Get my profile (return all editable fields)
exports.getMyProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, phone, address_line FROM users WHERE id=?",
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ getMyProfile:", err.message);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// Update my profile
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    await pool.query(
      "UPDATE users SET name=?, phone=?, address=?, updated_at=NOW() WHERE id=?",
      [name, phone, address, req.user.id]
    );

    // Notify user
    await notifyUser(req.user.id, "PROFILE_UPDATE", "Your profile was updated successfully");

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error("❌ updateMyProfile:", err.message);
    res.status(500).json({ success: false, message: "Server error updating profile" });
  }
};

// Admin -- list all users
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ getAllUsers:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching users" });
  }
};

// Admin -- user growth (weekly or monthly)
exports.getUserGrowth = async (req, res) => {
  try {
    const { interval } = req.query; // "week" or "month"
    let query;

    if (interval === "week") {
      query = `
        SELECT YEAR(created_at) as year, WEEK(created_at, 1) as week, COUNT(*) as count
        FROM users
        GROUP BY year, week
        ORDER BY year ASC, week ASC
      `;
    } else {
      // Default -- monthly
      query = `
        SELECT DATE_FORMAT(created_at, '%Y-%m') as period, COUNT(*) as count
        FROM users
        GROUP BY period
        ORDER BY period ASC
      `;
    }

    const [rows] = await pool.query(query);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ getUserGrowth:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching user growth" });
  }
};

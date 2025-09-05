const pool = require("../config/db");

// Get my notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, type, message, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ getMyNotifications:", err.message);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
};

// Mark single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?",
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("❌ markAsRead:", err.message);
    res.status(500).json({ message: "Server error updating notification" });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await pool.query("UPDATE notifications SET is_read=1 WHERE user_id=?", [req.user.id]);
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("❌ markAllAsRead:", err.message);
    res.status(500).json({ message: "Server error updating notifications" });
  }
};

// Admin → send manual notification
exports.sendNotification = async (req, res) => {
  try {
    const { user_id, type, message } = req.body;
    if (!user_id || !message) {
      return res.status(400).json({ message: "user_id and message are required" });
    }
    await pool.query(
      "INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)",
      [user_id, type || "SYSTEM", message]
    );
    res.status(201).json({ message: "Notification sent" });
  } catch (err) {
    console.error("❌ sendNotification:", err.message);
    res.status(500).json({ message: "Server error sending notification" });
  }
};

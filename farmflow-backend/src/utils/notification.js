const pool = require("../config/db");

exports.notifyUser = async (userId, type, message) => {
  try {
    await pool.query(
      "INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)",
      [userId, type, message]
    );
  } catch (err) {
    console.error("❌ notifyUser:", err.message);
  }
};

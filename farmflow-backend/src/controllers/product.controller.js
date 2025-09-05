const pool = require("../config/db");
const { notifyUser } = require("../utils/notification");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// Helper: normalize image URL
const normalizeImageUrl = (url) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
};

// Utility: fetch product images (with normalized URLs)
const getProductImages = async (productId) => {
  const [images] = await pool.query(
    "SELECT id, image_url, is_primary FROM product_images WHERE product_id=? ORDER BY is_primary DESC, id ASC",
    [productId]
  );
  return images.map((img) => ({
    ...img,
    image_url: normalizeImageUrl(img.image_url),
  }));
};

// Get all products with filters, sorting, pagination + primary image
exports.getAllProducts = async (req, res) => {
  try {
    let {
      category,
      sellerId,
      minPrice,
      maxPrice,
      isOrganic,
      status,
      sort,
      page,
      limit,
    } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    let baseQuery = `
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN units u ON p.unit_id = u.id
      JOIN users usr ON p.seller_id = usr.id
      WHERE 1=1
    `;
    let params = [];

    if (category) {
      baseQuery += " AND p.category_id = ?";
      params.push(category);
    }
    if (sellerId) {
      baseQuery += " AND p.seller_id = ?";
      params.push(sellerId);
    }
    if (minPrice) {
      baseQuery += " AND p.price >= ?";
      params.push(minPrice);
    }
    if (maxPrice) {
      baseQuery += " AND p.price <= ?";
      params.push(maxPrice);
    }
    if (typeof isOrganic !== "undefined") {
      const organicValue = ["1", "true", 1, true].includes(isOrganic) ? 1 : 0;
      baseQuery += " AND p.is_organic = ?";
      params.push(organicValue);
    }
    if (status) {
      baseQuery += " AND p.status = ?";
      params.push(status);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total ${baseQuery}`,
      params
    );
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    let query = `
      SELECT p.id, p.name, p.price, p.quantity_available, p.status,
             c.name AS category, u.name AS unit, usr.name AS seller
      ${baseQuery}
    `;

    if (sort) {
      if (sort === "price_asc") query += " ORDER BY p.price ASC";
      else if (sort === "price_desc") query += " ORDER BY p.price DESC";
      else if (sort === "newest") query += " ORDER BY p.created_at DESC";
      else if (sort === "oldest") query += " ORDER BY p.created_at ASC";
    } else {
      query += " ORDER BY p.created_at DESC";
    }

    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);

    // attach primary image
    for (let p of rows) {
      const [img] = await pool.query(
        "SELECT image_url FROM product_images WHERE product_id=? AND is_primary=1 LIMIT 1",
        [p.id]
      );
      p.image = img.length ? normalizeImageUrl(img[0].image_url) : null;
    }

    res.json({ success: true, page, limit, total, totalPages, data: rows });
  } catch (err) {
    console.error("❌ getAllProducts:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching products" });
  }
};

// Get product by ID (with images)
exports.getProductById = async (req, res) => {
  try {
    const [[product]] = await pool.query(
      `SELECT p.id, p.name, p.price, p.quantity_available, p.status,
              p.harvest_date, p.expiry_date, p.is_organic, p.description,
              c.name AS category, u.name AS unit, usr.name AS seller
       FROM products p
       JOIN categories c ON p.category_id = c.id
       JOIN units u ON p.unit_id = u.id
       JOIN users usr ON p.seller_id = usr.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const images = await getProductImages(req.params.id);

    res.json({ success: true, data: { ...product, images } });
  } catch (err) {
    console.error("❌ getProductById:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching product" });
  }
};

// Add product
exports.addProduct = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const {
      name,
      category_id,
      unit_id,
      price,
      quantity_available,
      harvest_date,
      expiry_date,
      is_organic,
      description,
    } = req.body;

    const seller_id = req.user.id;

    const [result] = await conn.query(
      `INSERT INTO products 
       (seller_id, name, category_id, unit_id, price, quantity_available, harvest_date, expiry_date, is_organic, description, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_APPROVAL')`,
      [
        seller_id,
        name,
        category_id,
        unit_id,
        price,
        quantity_available,
        harvest_date || null,
        expiry_date || null,
        is_organic ? 1 : 0,
        description || null,
      ]
    );

    const productId = result.insertId;

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        await conn.query(
          "INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)",
          [productId, `/uploads/${req.files[i].filename}`, i === 0 ? 1 : 0]
        );
      }
    }

    await notifyUser(
      1,
      "PRODUCT_UPDATE",
      `New product "${name}" added by seller (pending approval)`
    );

    await conn.commit();
    res.status(201).json({
      success: true,
      message: "Product added (pending approval)",
      data: { productId },
    });
  } catch (err) {
    await conn.rollback();
    console.error("❌ addProduct:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error adding product" });
  } finally {
    conn.release();
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;

    const [products] = await conn.query(
      "SELECT seller_id, name FROM products WHERE id=?",
      [id]
    );
    if (!products.length)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const product = products[0];
    if (req.user.role !== "ADMIN" && req.user.id !== product.seller_id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await conn.beginTransaction();

    // update fields
    const updates = [];
    const values = [];
    const fields = [
      "name",
      "price",
      "quantity_available",
      "description",
      "is_organic",
      "harvest_date",
      "expiry_date",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        updates.push(`${f}=?`);
        values.push(req.body[f]);
      }
    });

    if (updates.length) {
      values.push(id);
      await conn.query(
        `UPDATE products SET ${updates.join(", ")}, updated_at=NOW() WHERE id=?`,
        values
      );
    }

    // replace images if uploaded
    if (req.files && req.files.length > 0) {
      await conn.query("DELETE FROM product_images WHERE product_id=?", [id]);
      for (let i = 0; i < req.files.length; i++) {
        await conn.query(
          "INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)",
          [id, `/uploads/${req.files[i].filename}`, i === 0 ? 1 : 0]
        );
      }
    }

    if (req.user.role === "ADMIN") {
      await notifyUser(
        product.seller_id,
        "PRODUCT_UPDATE",
        `Your product "${product.name}" was updated by admin`
      );
    }

    await conn.commit();
    res.json({ success: true, message: "Product updated successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("❌ updateProduct:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error updating product" });
  } finally {
    conn.release();
  }
};

// Soft delete
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const [products] = await pool.query(
      "SELECT seller_id, name FROM products WHERE id=?",
      [productId]
    );
    if (!products.length)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const product = products[0];
    if (req.user.role !== "ADMIN" && req.user.id !== product.seller_id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await pool.query(
      "UPDATE products SET status='ARCHIVED', updated_at=NOW() WHERE id=?",
      [productId]
    );

    if (req.user.role === "ADMIN") {
      await notifyUser(
        product.seller_id,
        "PRODUCT_UPDATE",
        `Your product "${product.name}" was deactivated by admin`
      );
    }

    res.json({ success: true, message: "Product marked as inactive" });
  } catch (err) {
    console.error("❌ deleteProduct:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error deleting product" });
  }
};

// Hard delete
exports.hardDeleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const [products] = await pool.query(
      "SELECT seller_id, name FROM products WHERE id=?",
      [productId]
    );
    if (!products.length)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const product = products[0];
    if (req.user.role !== "ADMIN" && req.user.id !== product.seller_id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await pool.query("DELETE FROM products WHERE id=?", [productId]); // images cascade delete

    if (req.user.role === "ADMIN") {
      await notifyUser(
        product.seller_id,
        "PRODUCT_UPDATE",
        `Your product "${product.name}" was permanently deleted`
      );
    }

    res.json({ success: true, message: "Product permanently deleted" });
  } catch (err) {
    console.error("❌ hardDeleteProduct:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error hard deleting product",
    });
  }
};

// Update product status (Admin only)
exports.updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const [products] = await pool.query(
      "SELECT seller_id, name FROM products WHERE id=?",
      [req.params.id]
    );
    if (!products.length)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const product = products[0];
    await pool.query(
      "UPDATE products SET status=?, updated_at=NOW() WHERE id=?",
      [status, req.params.id]
    );

    await notifyUser(
      product.seller_id,
      "PRODUCT_UPDATE",
      `Your product "${product.name}" status changed to ${status}`
    );

    res.json({ success: true, message: `Product status updated to ${status}` });
  } catch (err) {
    console.error("❌ updateProductStatus:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error updating product status",
    });
  }
};

// Get logged-in farmer's products
exports.getMyProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.price, p.quantity_available, p.status,
              c.name AS category, u.name AS unit
       FROM products p
       JOIN categories c ON p.category_id = c.id
       JOIN units u ON p.unit_id = u.id
       WHERE p.seller_id = ?
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    for (let p of rows) {
      const [img] = await pool.query(
        "SELECT image_url FROM product_images WHERE product_id=? AND is_primary=1 LIMIT 1",
        [p.id]
      );
      p.image = img.length ? normalizeImageUrl(img[0].image_url) : null;
    }

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ getMyProducts:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching your products",
    });
  }
};

// Get pending products (Admin only)
exports.getPendingProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.price, p.quantity_available, p.status,
              c.name AS category, u.name AS unit, usr.name AS seller
       FROM products p
       JOIN categories c ON p.category_id = c.id
       JOIN units u ON p.unit_id = u.id
       JOIN users usr ON p.seller_id = usr.id
       WHERE p.status = 'PENDING_APPROVAL'
       ORDER BY p.created_at DESC`
    );

    for (let p of rows) {
      const [img] = await pool.query(
        "SELECT image_url FROM product_images WHERE product_id=? AND is_primary=1 LIMIT 1",
        [p.id]
      );
      p.image = img.length ? normalizeImageUrl(img[0].image_url) : null;
    }

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ getPendingProducts:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching pending products",
    });
  }
};

// Get product stats
exports.getProductStats = async (req, res) => {
  try {
    let query = `SELECT status, COUNT(*) as count FROM products`;
    let params = [];

    if (req.user.role === "FARMER") {
      query += " WHERE seller_id=?";
      params.push(req.user.id);
    }
    query += " GROUP BY status";

    const [rows] = await pool.query(query, params);

    const stats = rows.reduce((acc, r) => {
      acc[r.status] = r.count;
      return acc;
    }, {});

    res.json({ success: true, data: stats });
  } catch (err) {
    console.error("❌ getProductStats:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching product stats",
    });
  }
};

// Search products (with image)
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q)
      return res
        .status(400)
        .json({ success: false, message: "Search query required" });

    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.price, p.status, c.name AS category, usr.name AS seller
       FROM products p
       JOIN categories c ON p.category_id=c.id
       JOIN users usr ON p.seller_id=usr.id
       WHERE p.name LIKE ? OR p.description LIKE ?
       ORDER BY p.created_at DESC`,
      [`%${q}%`, `%${q}%`]
    );

    for (let p of rows) {
      const [img] = await pool.query(
        "SELECT image_url FROM product_images WHERE product_id=? AND is_primary=1 LIMIT 1",
        [p.id]
      );
      p.image = img.length ? normalizeImageUrl(img[0].image_url) : null;
    }

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ searchProducts:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error searching products",
    });
  }
};

// Get all possible product statuses
exports.getProductStatuses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SHOW COLUMNS FROM products LIKE 'status'"
    );
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Status column not found" });

    const column = rows[0].Type; // enum('DRAFT','PENDING_APPROVAL','ACTIVE',...)
    const statuses = column.match(/'([^']+)'/g).map((s) => s.replace(/'/g, ""));

    res.json({ success: true, data: statuses });
  } catch (err) {
    console.error("❌ getProductStatuses:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching statuses",
    });
  }
};

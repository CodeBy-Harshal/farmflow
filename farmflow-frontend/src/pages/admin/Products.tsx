import React, { useEffect, useState } from "react";
import api from "../../utils/api";

interface Product {
  id: number;
  name: string;
  seller: string;
  price: number;
  quantity_available: number;
  unit: string;
  category: string;
  status: string;
  created_at: string;
}

interface ProductDetails extends Product {
  harvest_date?: string;
  expiry_date?: string;
  is_organic: number;
  description?: string;
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-200 text-gray-800",
  PENDING_APPROVAL: "bg-yellow-100 text-yellow-800",
  REJECTED: "bg-red-100 text-red-800",
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [selected, setSelected] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterSeller, setFilterSeller] = useState<string>("");
  const [filterMinStock, setFilterMinStock] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      let data: Product[] = res.data.data || [];

      // Local filters
      if (filterStatus) data = data.filter((p) => p.status === filterStatus);
      if (filterSeller)
        data = data.filter((p) =>
          p.seller.toLowerCase().includes(filterSeller.toLowerCase())
        );
      if (filterMinStock)
        data = data.filter(
          (p) => p.quantity_available >= Number(filterMinStock)
        );
      if (filterDate)
        data = data.filter(
          (p) => new Date(p.created_at) >= new Date(filterDate)
        );

      setProducts(data);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await api.get("/products/statuses");
      setStatuses(res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching statuses:", err);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/products/${id}/status`, { status });
      alert(`✅ Product updated to ${status}`);
      fetchProducts();
    } catch (err) {
      console.error("❌ Error updating product status:", err);
      alert("Failed to update product status");
    }
  };

  const viewProduct = async (id: number) => {
    try {
      const res = await api.get(`/products/${id}`);
      setSelected(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching product details:", err);
    }
  };

  const deactivateProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to deactivate this product?"))
      return;
    try {
      await api.put(`/products/${id}`, { status: "INACTIVE" });
      alert("✅ Product deactivated");
      fetchProducts();
    } catch (err) {
      console.error("❌ Error deactivating product:", err);
      alert("Failed to deactivate product");
    }
  };

  const deleteProduct = async (id: number) => {
    if (
      !window.confirm(
        "⚠️ This will permanently delete the product. Continue?"
      )
    )
      return;
    try {
      await api.delete(`/products/${id}/hard`);
      alert("✅ Product deleted permanently");
      fetchProducts();
    } catch (err) {
      console.error("❌ Error deleting product:", err);
      alert("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchStatuses();
  }, []);

  const applyFilters = () => {
    fetchProducts();
  };

  const resetFilters = () => {
    setFilterStatus("");
    setFilterSeller("");
    setFilterMinStock("");
    setFilterDate("");
    fetchProducts();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Products</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold text-lg">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            className="border rounded px-2 py-1"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Seller name"
            className="border rounded px-2 py-1"
            value={filterSeller}
            onChange={(e) => setFilterSeller(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min stock"
            className="border rounded px-2 py-1"
            value={filterMinStock}
            onChange={(e) => setFilterMinStock(e.target.value)}
          />
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Apply
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-400 text-white px-4 py-1 rounded"
          >
            Reset
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading products...</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Seller</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t text-sm">
                <td
                  className="px-4 py-2 font-semibold text-blue-600 cursor-pointer"
                  onClick={() => viewProduct(p.id)}
                >
                  {p.name}
                </td>
                <td className="px-4 py-2">{p.category}</td>
                <td className="px-4 py-2">{p.seller}</td>
                <td className="px-4 py-2">₹{p.price}</td>
                <td className="px-4 py-2">
                  {p.quantity_available} {p.unit}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      statusColors[p.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <select
                    value={p.status}
                    onChange={(e) => updateStatus(p.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value={p.status} disabled>
                      {p.status}
                    </option>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => deactivateProduct(p.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && products.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for product details */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">{selected.name}</h2>

            <ul className="text-sm space-y-2 mb-4">
              <li>
                <span className="font-medium">Seller:</span> {selected.seller}
              </li>
              <li>
                <span className="font-medium">Category:</span> {selected.category}
              </li>
              <li>
                <span className="font-medium">Unit:</span> {selected.unit}
              </li>
              <li>
                <span className="font-medium">Price:</span> ₹{selected.price}
              </li>
              <li>
                <span className="font-medium">Stock:</span>{" "}
                {selected.quantity_available} {selected.unit}
              </li>
              <li>
                <span className="font-medium">Organic:</span>{" "}
                {selected.is_organic ? "✅ Yes" : "❌ No"}
              </li>
              {selected.harvest_date && (
                <li>
                  <span className="font-medium">Harvest Date:</span>{" "}
                  {new Date(selected.harvest_date).toLocaleDateString()}
                </li>
              )}
              {selected.expiry_date && (
                <li>
                  <span className="font-medium">Expiry Date:</span>{" "}
                  {new Date(selected.expiry_date).toLocaleDateString()}
                </li>
              )}
              {selected.description && (
                <li>
                  <span className="font-medium">Description:</span>{" "}
                  {selected.description}
                </li>
              )}
            </ul>

            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

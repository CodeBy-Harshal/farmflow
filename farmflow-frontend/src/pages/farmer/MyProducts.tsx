import React, { useEffect, useState } from "react";
import api from "../../utils/api";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity_available: number;
  status: string;
  category: string;
  unit: string;
}

const MyProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let res;
      if (search.trim()) {
        // Search API
        res = await api.get("/farmer/products/search", {
          params: { q: search },
        });
      } else {
        // Normal product listing with filters
        res = await api.get("/products/my", {
          params: {
            category,
            status,
            minPrice,
            maxPrice,
          },
        });
      }

      setProducts(res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, status, minPrice, maxPrice, search]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Products</h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="🔎 Search by name/description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded col-span-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="1">Grains</option>
          <option value="2">Vegetables</option>
          <option value="3">Fruits</option>
          <option value="4">Dairy</option>
          <option value="5">Pulses</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING_APPROVAL">Pending</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border p-2 rounded w-20"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border p-2 rounded w-20"
          />
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.category}</td>
                <td className="border p-2">{p.unit}</td>
                <td className="border p-2">₹{p.price}</td>
                <td className="border p-2">{p.quantity_available}</td>
                <td className="border p-2">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyProducts;

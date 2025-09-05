import React, { useEffect, useState } from "react";
import api from "../../utils/api";

interface Order {
  id: number;
  order_number: string;
  product: string;
  buyer: string;
  seller: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrderDetails extends Order {
  subtotal_amount: number;
  shipping_amount: number;
  discount_amount: number;
  notes?: string;
  items: { product: string; unit_price: number; quantity: number; line_total: number }[];
  history: { status: string; changed_at: string }[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [selected, setSelected] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterBuyer, setFilterBuyer] = useState<string>("");
  const [filterSeller, setFilterSeller] = useState<string>("");
  const [filterStart, setFilterStart] = useState<string>("");
  const [filterEnd, setFilterEnd] = useState<string>("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      let data: Order[] = res.data.data || [];

      if (filterStatus) data = data.filter((o) => o.status === filterStatus);
      if (filterBuyer) data = data.filter((o) => o.buyer.toLowerCase().includes(filterBuyer.toLowerCase()));
      if (filterSeller) data = data.filter((o) => o.seller.toLowerCase().includes(filterSeller.toLowerCase()));
      if (filterStart) data = data.filter((o) => new Date(o.created_at) >= new Date(filterStart));
      if (filterEnd) data = data.filter((o) => new Date(o.created_at) <= new Date(filterEnd));

      setOrders(data);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await api.get("/orders/statuses");
      setStatuses(res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching statuses:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStatuses();
  }, []);

  const applyFilters = () => fetchOrders();
  const resetFilters = () => {
    setFilterStatus("");
    setFilterBuyer("");
    setFilterSeller("");
    setFilterStart("");
    setFilterEnd("");
    fetchOrders();
  };

  const viewOrder = async (id: number) => {
    try {
      const res = await api.get(`/orders/${id}`);
      setSelected(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching order details:", err);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      alert(`✅ Order updated to ${status}`);
      fetchOrders();
      if (selected?.id === id) viewOrder(id);
    } catch (err) {
      console.error("❌ Error updating order status:", err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Orders</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold text-lg">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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
            placeholder="Buyer name"
            className="border rounded px-2 py-1"
            value={filterBuyer}
            onChange={(e) => setFilterBuyer(e.target.value)}
          />
          <input
            type="text"
            placeholder="Seller name"
            className="border rounded px-2 py-1"
            value={filterSeller}
            onChange={(e) => setFilterSeller(e.target.value)}
          />
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={filterStart}
            onChange={(e) => setFilterStart(e.target.value)}
          />
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={filterEnd}
            onChange={(e) => setFilterEnd(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={applyFilters} className="bg-blue-600 text-white px-4 py-1 rounded">
            Apply
          </button>
          <button onClick={resetFilters} className="bg-gray-400 text-white px-4 py-1 rounded">
            Reset
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading orders...</p>}

      {/* Orders table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
              <th className="px-4 py-2">Order #</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Buyer</th>
              <th className="px-4 py-2">Seller</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t text-sm">
                <td className="px-4 py-2">{o.order_number}</td>
                <td className="px-4 py-2">{o.product}</td>
                <td className="px-4 py-2">{o.buyer}</td>
                <td className="px-4 py-2">{o.seller}</td>
                <td className="px-4 py-2">₹{o.total_amount}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      statusColors[o.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => viewOrder(o.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                  <select
                    className="border rounded px-2 py-1"
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                  >
                    <option value={o.status} disabled>
                      {o.status}
                    </option>
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-2">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">
              Order {selected.order_number}
            </h2>

            <h3 className="font-semibold">Items</h3>
            <ul className="mb-4 text-sm">
              {selected.items.map((it, i) => (
                <li key={i}>
                  {it.product} — {it.quantity} × ₹{it.unit_price} = ₹{it.line_total}
                </li>
              ))}
            </ul>

            <h3 className="font-semibold">Summary</h3>
            <ul className="text-sm mb-4">
              <li>Subtotal: ₹{selected.subtotal_amount}</li>
              <li>Shipping: ₹{selected.shipping_amount}</li>
              <li>Discount: ₹{selected.discount_amount}</li>
              <li className="font-bold">Total: ₹{selected.total_amount}</li>
            </ul>

            <h3 className="font-semibold">Status History</h3>
            <ul className="text-sm mb-4">
              {selected.history.map((h, i) => (
                <li key={i}>
                  {h.status} — {new Date(h.changed_at).toLocaleString()}
                </li>
              ))}
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

export default AdminOrders;

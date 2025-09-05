import React, { useEffect, useState } from "react";
import api from "../../utils/api";

interface Order {
  id: number;
  order_number: string;
  seller: string;
  status: string;
  total_amount: number;
  notes?: string;
  created_at: string;
}

interface OrderDetails extends Order {
  subtotal_amount: number;
  shipping_amount: number;
  discount_amount: number;
  items: { product: string; unit_price: number; quantity: number; line_total: number }[];
  history: { status: string; changed_at: string }[];
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<OrderDetails | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const viewOrder = async (id: number) => {
    try {
      const res = await api.get(`/orders/${id}`);
      setSelected(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching order details:", err);
    }
  };

  const cancelOrder = async (id: number) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await api.put(`/orders/${id}/cancel`);
      fetchOrders();
    } catch (err) {
      console.error("❌ Error cancelling order:", err);
      alert("Failed to cancel order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">📦 My Orders</h1>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border rounded-lg bg-white shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
              <th className="px-4 py-2">Order #</th>
              <th className="px-4 py-2">Seller</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t text-sm">
                <td className="px-4 py-2 text-green-700 font-medium">{o.order_number}</td>
                <td className="px-4 py-2">{o.seller}</td>
                <td className="px-4 py-2">{o.status}</td>
                <td className="px-4 py-2">₹{o.total_amount}</td>
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
                  {o.status === "PENDING" && (
                    <button
                      onClick={() => cancelOrder(o.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-2 text-center text-gray-500">
                  No orders yet
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

            {/* Items */}
            <h3 className="font-semibold">Items</h3>
            <ul className="mb-4">
              {selected.items.map((it, i) => (
                <li key={i} className="text-sm">
                  {it.product} — {it.quantity} × ₹{it.unit_price} = ₹{it.line_total}
                </li>
              ))}
            </ul>

            {/* Financials */}
            <h3 className="font-semibold">Summary</h3>
            <ul className="text-sm mb-4">
              <li>Subtotal: ₹{selected.subtotal_amount}</li>
              <li>Shipping: ₹{selected.shipping_amount}</li>
              <li>Discount: ₹{selected.discount_amount}</li>
              <li className="font-bold">Total: ₹{selected.total_amount}</li>
            </ul>

            {/* Status timeline */}
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

export default MyOrders;

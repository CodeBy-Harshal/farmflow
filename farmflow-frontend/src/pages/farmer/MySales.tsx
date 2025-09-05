import React, { useEffect, useState } from "react";
import api from "../../utils/api";

interface Sale {
  id: number;
  order_number: string;
  product: string;
  buyer: string;
  status: string;
  total_amount: number;
  nextStatuses?: string[];
}

interface SaleDetails extends Sale {
  subtotal_amount: number;
  shipping_amount: number;
  discount_amount: number;
  items: { product: string; unit_price: number; quantity: number; line_total: number }[];
  history: { status: string; changed_at: string }[];
}

const MySales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SaleDetails | null>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/sales");

      // For each order, fetch allowed next statuses
      const salesWithStatuses = await Promise.all(
        res.data.data.map(async (s: Sale) => {
          try {
            const statusRes = await api.get(`/orders/${s.id}/next-statuses`);
            return { ...s, nextStatuses: statusRes.data.data || [] };
          } catch {
            return { ...s, nextStatuses: [] };
          }
        })
      );

      setSales(salesWithStatuses);
    } catch (err) {
      console.error("Error fetching sales:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (id: number) => {
    try {
      const res = await api.get(`/orders/${id}`);
      setSelected(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching order details:", err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      alert(`✅ Order updated to ${status}`);
      fetchSales();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("❌ Failed to update order");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Sales</h1>

      {loading && <p className="text-gray-500">Loading sales...</p>}

      <div className="space-y-4">
        {sales.map((s) => (
          <div
            key={s.id}
            className="p-4 border rounded bg-white shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{s.order_number}</p>
              <p className="text-sm text-gray-600">
                {s.product} · Buyer: {s.buyer}
              </p>
              <p className="text-sm">
                ₹{s.total_amount} —{" "}
                <span className="font-medium">{s.status}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Status dropdown */}
              <select
                className="border rounded px-2 py-1"
                value={s.status}
                onChange={(e) => updateStatus(s.id, e.target.value)}
              >
                <option value={s.status} disabled>
                  {s.status}
                </option>
                {s.nextStatuses?.map((st: string) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              {/* View button */}
              <button
                onClick={() => fetchDetails(s.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                View
              </button>
            </div>
          </div>
        ))}

        {!loading && sales.length === 0 && (
          <p className="text-gray-500">No sales yet</p>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">
              Order {selected.order_number}
            </h2>

            <p className="mb-2 text-sm text-gray-600">
              Buyer: {selected.buyer}
            </p>

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

export default MySales;

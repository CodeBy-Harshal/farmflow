import React, { useEffect, useState } from "react";
import api from "../../utils/api";

interface Summary {
  total_orders: number;
  completed_orders: number;
  total_spent: number;
}

interface Stats {
  [key: string]: number;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  product: string;
  seller: string;
  notes?: string;
  created_at: string;
}

const BuyerDashboard: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [stats, setStats] = useState<Stats>({});
  const [latestOrders, setLatestOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/buyer/dashboard");
        setSummary(res.data.summary || null);
        setStats(res.data.orderBreakdown || {});
        setLatestOrders(res.data.latestOrders || []);
      } catch (err) {
        console.error("❌ Error fetching buyer dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Buyer Dashboard</h1>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-white shadow text-center">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">{summary.total_orders}</p>
          </div>
          <div className="p-4 border rounded-lg bg-white shadow text-center">
            <p className="text-sm text-gray-600">Completed Orders</p>
            <p className="text-2xl font-bold">{summary.completed_orders}</p>
          </div>
          <div className="p-4 border rounded-lg bg-white shadow text-center">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold">₹{summary.total_spent}</p>
          </div>
        </div>
      )}

      {/* Order Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-2">📊 Order Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([status, count]) => (
            <div
              key={status}
              className="p-4 border rounded-lg bg-white shadow text-center"
            >
              <p className="text-sm font-medium text-gray-600">{status}</p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          ))}
          {Object.keys(stats).length === 0 && (
            <p className="col-span-full text-gray-500">No orders yet</p>
          )}
        </div>
      </div>

      {/* Latest Orders */}
      <div>
        <h2 className="text-lg font-semibold mb-2">🛒 Latest Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg bg-white shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
                <th className="px-4 py-2">Order #</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Seller</th>
                <th className="px-4 py-2">Notes</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((order) => (
                <tr key={order.id} className="border-t text-sm">
                  <td className="px-4 py-2 font-medium text-green-700">
                    {order.order_number}
                  </td>
                  <td className="px-4 py-2">{order.product}</td>
                  <td className="px-4 py-2">{order.seller}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {order.notes || "-"}
                  </td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">₹{order.total_amount}</td>
                  <td className="px-4 py-2">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {latestOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-2 text-center text-gray-500">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;

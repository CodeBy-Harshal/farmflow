import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";

type Stats = Record<string, number>;

interface Order {
  id: number;
  order_number: string;
  buyer: string;
  seller: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  seller: string;
  category: string;
  status: string;
  created_at: string;
}

interface UserGrowth {
  period: string;
  count: number;
}

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#F44336", "#9C27B0"];

const AdminDashboard: React.FC = () => {
  const [orderStats, setOrderStats] = useState<Stats>({});
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [ordersOverTime, setOrdersOverTime] = useState<any[]>([]);
  const [topCategories, setTopCategories] = useState<any[]>([]);
  const [topSellers, setTopSellers] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([]);
  const [growthInterval, setGrowthInterval] = useState<"week" | "month">(
    "month"
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchUserGrowth();
  }, [growthInterval]);

  const fetchDashboardData = async () => {
    try {
      // Order stats
      const statsRes = await api.get("/orders/stats");
      setOrderStats(statsRes.data.data || {});

      // All orders
      const ordersRes = await api.get("/orders");
      const orders: Order[] = ordersRes.data.data || [];
      setRecentOrders(orders.slice(0, 5));

      // Pending products
      const pendingRes = await api.get("/products?status=PENDING_APPROVAL");
      setPendingProducts(pendingRes.data.data?.slice(0, 5) || []);

      // Orders over time
      const grouped: Record<string, number> = {};
      orders.forEach((o) => {
        const date = new Date(o.created_at).toLocaleDateString();
        grouped[date] = (grouped[date] || 0) + 1;
      });
      setOrdersOverTime(
        Object.entries(grouped).map(([date, count]) => ({ date, count }))
      );

      // Top categories
      const productsRes = await api.get("/products");
      const catMap: Record<string, number> = {};
      (productsRes.data.data || []).forEach((p: Product) => {
        catMap[p.category] = (catMap[p.category] || 0) + 1;
      });
      setTopCategories(
        Object.entries(catMap).map(([category, count]) => ({ category, count }))
      );

      // Top sellers
      const sellerMap: Record<string, number> = {};
      orders.forEach((o) => {
        sellerMap[o.seller] = (sellerMap[o.seller] || 0) + o.total_amount;
      });
      setTopSellers(
        Object.entries(sellerMap)
          .map(([seller, total]) => ({ seller, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5)
      );
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
    }
  };

  const fetchUserGrowth = async () => {
    try {
      const res = await api.get(`/users/stats/growth?interval=${growthInterval}`);
      const formatted = res.data.data.map((row: any) => ({
        period: row.period || `W${row.week}-${row.year}`,
        count: row.count,
      }));
      setUserGrowth(formatted);
    } catch (err) {
      console.error("❌ Error fetching user growth:", err);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">📊 Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 shadow rounded-lg text-center">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold">
            {Object.values(orderStats).reduce((a, b) => a + b, 0)}
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg text-center">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold">{orderStats.PENDING || 0}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg text-center">
          <p className="text-sm text-gray-600">Delivered</p>
          <p className="text-2xl font-bold">{orderStats.DELIVERED || 0}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg text-center">
          <p className="text-sm text-gray-600">Cancelled</p>
          <p className="text-2xl font-bold">{orderStats.CANCELLED || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="font-semibold mb-4">Order Status Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={Object.entries(orderStats).map(([status, count]) => ({
                  name: status,
                  value: count,
                }))}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {Object.entries(orderStats).map(([status], i) => (
                  <Cell key={status} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Over Time */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="font-semibold mb-4">Orders Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ordersOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#2196F3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Growth */}
      <div className="bg-white p-4 shadow rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">User Growth</h2>
          <select
            value={growthInterval}
            onChange={(e) =>
              setGrowthInterval(e.target.value as "week" | "month")
            }
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#9C27B0" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Categories & Sellers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="font-semibold mb-4">Top Categories</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="font-semibold mb-4">Top Sellers (Revenue)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topSellers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="seller" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600">
                <th className="px-4 py-2">Order #</th>
                <th className="px-4 py-2">Buyer</th>
                <th className="px-4 py-2">Seller</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-4 py-2">{o.order_number}</td>
                  <td className="px-4 py-2">{o.buyer}</td>
                  <td className="px-4 py-2">{o.seller}</td>
                  <td className="px-4 py-2">₹{o.total_amount}</td>
                  <td className="px-4 py-2">{o.status}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-2">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Product Approvals */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="font-semibold mb-4">Pending Product Approvals</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Seller</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingProducts.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.seller}</td>
                  <td className="px-4 py-2">{p.status}</td>
                </tr>
              ))}
              {pendingProducts.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 py-2">
                    No pending products
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

export default AdminDashboard;

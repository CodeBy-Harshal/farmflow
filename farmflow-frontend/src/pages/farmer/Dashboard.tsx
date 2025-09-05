import React, { useEffect, useState } from "react";
import api from "../../utils/api";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/farmer/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };
    fetchData();
  }, []);

  if (!data) return <p className="text-center">Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Farmer Dashboard</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-600">Products</h2>
          <p className="text-xl">{data.summary.products}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-600">Sales</h2>
          <p className="text-xl">{data.summary.sales}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-600">Revenue</h2>
          <p className="text-xl">₹{data.summary.revenue}</p>
        </div>
      </div>

      {/* Recent Products */}
      <h2 className="text-xl font-semibold mb-2">Latest Products</h2>
      <ul className="mb-6">
        {data.latestProducts.map((p: any) => (
          <li key={p.id}>
            {p.name} - ₹{p.price} ({p.status})
          </li>
        ))}
      </ul>

      {/* Recent Sales */}
      <h2 className="text-xl font-semibold mb-2">Latest Sales</h2>
      <ul>
        {data.latestSales.map((s: any) => (
          <li key={s.id}>
            {s.order_number} - {s.buyer} - ₹{s.total_amount} ({s.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

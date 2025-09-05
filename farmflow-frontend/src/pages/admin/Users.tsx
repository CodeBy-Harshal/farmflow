import React, { useEffect, useState } from "react";
import api from "../../utils/api";

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-800",
  FARMER: "bg-green-100 text-green-800",
  BUYER: "bg-blue-100 text-blue-800",
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filterRole, setFilterRole] = useState<string>("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      let data = res.data.data || [];

      // Filter locally
      if (filterRole) {
        data = data.filter((u: any) => u.role === filterRole);
      }

      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">👥 Manage Users</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow flex items-center gap-3">
        <select
          className="border rounded px-3 py-1"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="FARMER">Farmer</option>
          <option value="BUYER">Buyer</option>
        </select>
        {filterRole && (
          <button
            onClick={() => setFilterRole("")}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Reset
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t text-sm">
                <td className="px-4 py-2">{u.id}</td>
                <td className="px-4 py-2 font-medium">{u.name}</td>
                <td className="px-4 py-2 text-gray-600">{u.email}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      roleColors[u.role] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;

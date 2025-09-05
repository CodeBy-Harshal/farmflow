import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import PaymentModal from "../../components/PaymentModal";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity_available: number;
  category: string;
  unit: string;
  seller: string;
  image?: string | null;
}

type PaymentState = {
  open: boolean;
  paymentId?: number;
  orderId?: number;
  amount?: number;
  orderNumber?: string;
  upiUri?: string;
  qrDataUrl?: string;
};

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [pay, setPay] = useState<PaymentState>({ open: false });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (query = "") => {
    try {
      const res = await api.get(`/products?status=ACTIVE&q=${encodeURIComponent(query)}`);
      setProducts(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(search);
  };

  // Place order -- initiate payment
  const placeOrder = async (productId: number) => {
    try {
      const orderRes = await api.post("/orders", {
        product_id: productId,
        quantity: 1,
        notes: notes || null,
      });

      const { orderId, orderNumber, totalAmount } = orderRes.data?.data || {};
      if (!orderId) {
        alert("Order created, but missing order id.");
        return;
      }

      const payRes = await api.post("/payments/initiate", { order_id: orderId });
      const { paymentId, upiUri, qrDataUrl, amount } = payRes.data?.data || {};

      if (!paymentId || !upiUri || !qrDataUrl) {
        alert("Failed to initiate payment.");
        return;
      }

      setPay({
        open: true,
        paymentId,
        orderId,
        amount: amount ?? totalAmount,
        orderNumber,
        upiUri,
        qrDataUrl,
      });

      setNotes("");
    } catch (err) {
      console.error("❌ Error placing order / initiating payment:", err);
      alert("Failed to place order or initiate payment");
    }
  };

  if (loading) return <p className="p-6">Loading products...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">🌾 Marketplace</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="border px-4 py-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-green-500"
        />
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700">
          Search
        </button>
      </form>

      {/* Notes */}
      <div className="mt-4">
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add order notes (optional)..."
          className="border px-4 py-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-xl bg-white shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            {p.image ? (
              <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                No Image Available
              </div>
            )}

            <div className="p-4 flex flex-col flex-grow">
              <h2 className="font-semibold text-lg">{p.name}</h2>
              <p className="text-sm text-gray-600 mb-1">
                {p.category} · {p.unit}
              </p>
              <p className="font-bold text-green-700 text-lg mb-1">₹{p.price}</p>
              <p className="text-sm">Available: {p.quantity_available}</p>
              <p className="text-sm text-gray-500 mb-3">Seller: {p.seller}</p>

              <button
                onClick={() => placeOrder(p.id)}
                className="mt-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full transition"
              >
                Buy
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="col-span-full text-gray-500 text-center">No products found</p>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={pay.open}
        onClose={() => setPay({ open: false })}
        amount={pay.amount || 0}
        orderId={pay.orderId || 0}
        orderNumber={pay.orderNumber || ""}
        upiUri={pay.upiUri || ""}
        qrDataUrl={pay.qrDataUrl || ""}
        paymentId={pay.paymentId}
        onRefreshOrders={async () => {
          await fetchProducts();
          setPay({ open: false });
        }}
      />
    </div>
  );
};

export default Marketplace;

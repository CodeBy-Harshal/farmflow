import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import api from "../utils/api";

type Props = {
  open: boolean;
  onClose: () => void;
  amount: number;
  orderId: number;
  orderNumber: string;
  upiUri: string;
  qrDataUrl: string;
  paymentId?: number;
  onRefreshOrders: () => Promise<void>;
};

const PaymentModal: React.FC<Props> = ({
  open,
  onClose,
  amount,
  orderId,
  orderNumber,
  upiUri,
  qrDataUrl,
  paymentId,
  onRefreshOrders,
}) => {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // Confirm Payment
  const handleConfirmPaid = async () => {
    if (!paymentId) return;
    try {
      setLoading(true);
      const res = await api.post(`/payments/${paymentId}/confirm`);
      if (res.data.success) {
        alert("✅ Payment confirmed successfully!");
        await onRefreshOrders();
        onClose();
      } else {
        alert("⚠️ Failed: " + res.data.message);
      }
    } catch (err) {
      alert("❌ Error confirming payment.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel Order
  const handleCancelOrder = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const res = await api.post(`/orders/${orderId}/cancel`);
      if (res.data.success) {
        alert("❌ Order cancelled.");
        await onRefreshOrders();
        onClose();
      } else {
        alert("⚠️ Failed: " + res.data.message);
      }
    } catch (err) {
      alert("❌ Error cancelling order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative z-10">
        <Dialog.Title className="text-xl font-bold text-green-700 mb-4">
          💳 Complete Your Payment
        </Dialog.Title>

        <p className="text-gray-600 mb-2">
          <strong>Order:</strong> {orderNumber}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Amount:</strong> ₹{amount}
        </p>

        {qrDataUrl && (
          <div className="flex justify-center mb-4">
            <img src={qrDataUrl} alt="UPI QR" className="w-48 h-48" />
          </div>
        )}
        {upiUri && (
          <p className="text-sm text-center text-gray-500 break-all mb-4">
            {upiUri}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleConfirmPaid}
            disabled={loading}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
          >
            ✅ I Have Paid
          </button>
          <button
            onClick={handleCancelOrder}
            disabled={loading}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition disabled:opacity-50"
          >
            ❌ Cancel Order
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default PaymentModal;

import React, { useState } from "react";
import { X, User, Building, Mail, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"FARMER" | "BUYER">("FARMER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }

      onClose();
      setName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error(`${mode} failed:`, error);
      alert(error.message || `Failed to ${mode}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "login" ? "Sign In to FarmFlow" : "Create Your FarmFlow Account"}
            </h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Role selector only in register */}
          {mode === "register" && (
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                onClick={() => setRole("FARMER")}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border-2 ${
                  role === "FARMER"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Farmer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("BUYER")}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border-2 ${
                  role === "BUYER"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Building className="h-5 w-5" />
                <span className="font-medium">Buyer</span>
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700"
            >
              {isLoading
                ? mode === "login"
                  ? "Signing in..."
                  : "Signing up..."
                : mode === "login"
                ? "Sign In"
                : "Sign Up"}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            {mode === "login" ? (
              <p className="text-sm text-gray-600">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-green-600 hover:underline font-medium"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-green-600 hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

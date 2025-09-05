import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";
import { useTranslation } from "react-i18next";

type Item = { path: string; key: string };

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();

  const navItems: Record<string, Item[]> = {
    FARMER: [
      { path: "/farmer/dashboard", key: "nav.dashboard" },
      { path: "/farmer/my-products", key: "nav.products" },
      { path: "/farmer/add-product", key: "nav.addProduct" },
      { path: "/farmer/my-sales", key: "nav.sales" },
      { path: "/crop-analysis", key: "nav.cropInsights" },
      { path: "/ai-chat", key: "nav.assistant" },
    ],
    BUYER: [
      { path: "/buyer/dashboard", key: "nav.dashboard" },
      { path: "/marketplace", key: "nav.marketplace" },
      { path: "/buyer/my-orders", key: "nav.orders" },
      { path: "/ai-chat", key: "nav.assistant" },
    ],
    ADMIN: [
      { path: "/admin/dashboard", key: "nav.dashboard" },
      { path: "/admin/users", key: "nav.users" },
      { path: "/admin/products", key: "nav.productCatalog" },
    ],
    GUEST: [{ path: "/", key: "nav.home" }],
  };

  const role = user?.role || "GUEST";
  const items = navItems[role];

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
    { code: "mr", label: "मराठी", flag: "🇮🇳" },
    { code: "gu", label: "ગુજરાતી", flag: "🇮🇳" },
    { code: "te", label: "తెలుగు", flag: "🇮🇳" }
  ];

  const current = languages.find(l => l.code === i18n.resolvedLanguage) || languages[0];

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-green-600">
            {t("app.name")}
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium hover:text-green-600 ${
                  location.pathname === item.path
                    ? "text-green-700 underline"
                    : "text-gray-700"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Right side: language + auth */}
          <div className="flex items-center space-x-4">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(v => !v)}
                className="px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
              >
                <span className="mr-1">{current.flag}</span>
                {current.label}
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth */}
            {isAuthenticated && user ? (
              <>
                <span className="text-gray-600 text-sm">
                  👋 {user.name}{" "}
                  <span className="ml-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    {t(`role.${user.role.toLowerCase()}`)}
                  </span>
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  {t("actions.logout")}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                {t("actions.login")}
              </button>
            )}
          </div>
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Header;

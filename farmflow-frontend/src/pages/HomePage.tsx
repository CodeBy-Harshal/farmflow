import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Cloud, Camera, ShoppingCart, Leaf, TrendingUp, Shield, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Get instant help and smart farming advice powered by AI.",
      href: "/ai-chat",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Cloud,
      title: "Weather Insights",
      description: "Accurate forecasts tailored for your crops and location.",
      href: "/weather",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: ShoppingCart,
      title: "Marketplace",
      description: "Buy and sell crops directly with trusted partners.",
      href: "/marketplace",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Camera,
      title: "Crop Analysis",
      description: "Analyze crop health and detect issues early with AI.",
      href: "/crop-analysis",
      color: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { label: "Active Farmers", value: "25,000+", icon: Users },
    { label: "Crops Analyzed", value: "1.2M+", icon: Leaf },
    { label: "Successful Trades", value: "500K+", icon: TrendingUp },
    { label: "Data Security", value: "99.9%", icon: Shield },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Smarter Farming with AI & Technology
              </h1>
              <p className="text-xl lg:text-2xl opacity-90 mb-8 leading-relaxed">
                Empowering farmers and buyers with AI-driven insights and modern tools.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2"
                alt="Modern farming with technology"
                className="rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Yield Increase</p>
                    <p className="text-2xl font-bold text-green-600">+34%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-2xl inline-flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <stat.icon className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Agriculture
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Harness the power of AI and modern technology to transform your farming experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.href}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div
                  className={`bg-gradient-to-br ${feature.color} p-4 rounded-xl inline-flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center text-green-600 font-medium group-hover:text-green-700">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Agricultural Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of farmers and buyers who are already benefiting from AI-powered agriculture
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

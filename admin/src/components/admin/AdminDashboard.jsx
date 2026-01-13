import React from 'react';
import {
  Users,
  Gift,
  Receipt,
  TrendingUp,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  Activity,
  ShoppingBag,
  CreditCard,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../common/StatCard';

// Demo data
const weeklyRevenue = [
  { day: 'Mon', revenue: 12500, transactions: 45 },
  { day: 'Tue', revenue: 15200, transactions: 52 },
  { day: 'Wed', revenue: 18900, transactions: 61 },
  { day: 'Thu', revenue: 14300, transactions: 48 },
  { day: 'Fri', revenue: 21500, transactions: 72 },
  { day: 'Sat', revenue: 24800, transactions: 85 },
  { day: 'Sun', revenue: 19200, transactions: 68 },
];

const tierDistribution = [
  { tier: 'Bronze', users: 450, color: '#cd7f32' },
  { tier: 'Silver', users: 280, color: '#9ca3af' },
  { tier: 'Gold', users: 156, color: '#fbbf24' },
  { tier: 'Platinum', users: 42, color: '#e5e7eb' },
];

const recentTransactions = [
  { id: 'TXN-001', type: 'load', amount: 500, user: 'สมชาย ใ.', time: '2 mins ago' },
  { id: 'TXN-002', type: 'purchase', amount: 85, user: 'สุดา ส.', time: '5 mins ago' },
  { id: 'TXN-003', type: 'redemption', amount: 0, user: 'กิตติ ด.', time: '12 mins ago' },
  { id: 'TXN-004', type: 'load', amount: 1000, user: 'พิมพ์ใจ ร.', time: '18 mins ago' },
  { id: 'TXN-005', type: 'purchase', amount: 120, user: 'นภา ท.', time: '25 mins ago' },
];

const topRewards = [
  { name: 'Free Americano', redeemed: 234, percentage: 35 },
  { name: 'Signature Latte', redeemed: 156, percentage: 25 },
  { name: 'Croissant', redeemed: 89, percentage: 15 },
  { name: 'Double Points Day', redeemed: 567, percentage: 90 },
];

const typeColors = {
  load: 'text-green-600 bg-green-100',
  purchase: 'text-blue-600 bg-blue-100',
  redemption: 'text-purple-600 bg-purple-100',
  refund: 'text-red-600 bg-red-100',
};

const AdminDashboard = () => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'revenue' ? `฿${entry.value.toLocaleString()}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="฿126,400"
          change={12.5}
          changeLabel="vs last week"
          icon={DollarSign}
          iconColor="success"
        />
        <StatCard
          title="Active Users"
          value="928"
          change={8.2}
          changeLabel="vs last week"
          icon={Users}
          iconColor="primary"
        />
        <StatCard
          title="Transactions"
          value="431"
          change={15.3}
          changeLabel="vs last week"
          icon={Receipt}
          iconColor="info"
        />
        <StatCard
          title="Rewards Redeemed"
          value="1,046"
          change={-3.2}
          changeLabel="vs last week"
          icon={Gift}
          iconColor="secondary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Weekly Revenue</h3>
              <p className="text-sm text-gray-500">Revenue and transactions this week</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary-500"></div>
                <span className="text-gray-600">Transactions</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v) => `฿${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1e3a5f"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tier Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Tiers</h3>
          <div className="space-y-4">
            {tierDistribution.map((tier) => {
              const total = tierDistribution.reduce((sum, t) => sum + t.users, 0);
              const percentage = ((tier.users / total) * 100).toFixed(0);
              return (
                <div key={tier.tier}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }}></div>
                      <span className="text-sm font-medium text-gray-700">{tier.tier}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{tier.users}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: tier.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Members</span>
              <span className="text-lg font-bold text-gray-900">
                {tierDistribution.reduce((sum, t) => sum + t.users, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <a href="/admin/transactions" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </a>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[txn.type]}`}>
                    {txn.type === 'load' ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : txn.type === 'purchase' ? (
                      <CreditCard className="w-5 h-5" />
                    ) : txn.type === 'redemption' ? (
                      <Gift className="w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{txn.user}</p>
                    <p className="text-sm text-gray-500 capitalize">{txn.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${txn.type === 'load' ? 'text-green-600' : 'text-gray-900'}`}>
                    {txn.type === 'load' ? '+' : txn.type === 'redemption' ? '' : '-'}฿{txn.amount}
                  </p>
                  <p className="text-xs text-gray-400">{txn.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rewards */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Rewards</h3>
            <a href="/admin/rewards" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Manage →
            </a>
          </div>
          <div className="space-y-4">
            {topRewards.map((reward, index) => (
              <div key={reward.name} className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-secondary-100 text-secondary-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{reward.name}</span>
                    <span className="text-sm text-gray-500">{reward.redeemed} redeemed</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary-500 rounded-full transition-all duration-500"
                      style={{ width: `${reward.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-secondary-400" />
              <span className="text-primary-200 text-sm">Active Sessions</span>
            </div>
            <p className="text-3xl font-bold">124</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShoppingBag className="w-5 h-5 text-secondary-400" />
              <span className="text-primary-200 text-sm">Today's Sales</span>
            </div>
            <p className="text-3xl font-bold">฿18.5k</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-secondary-400" />
              <span className="text-primary-200 text-sm">Points Issued</span>
            </div>
            <p className="text-3xl font-bold">2,340</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-secondary-400" />
              <span className="text-primary-200 text-sm">New Members</span>
            </div>
            <p className="text-3xl font-bold">28</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

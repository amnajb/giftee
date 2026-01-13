import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Gift,
  Star,
  Filter,
  RefreshCw,
  ChevronDown,
  BarChart3,
  PieChart,
  LineChart,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Line,
} from 'recharts';
import StatCard from '../common/StatCard';

// Demo data
const monthlyRevenueData = [
  { month: 'Jan', revenue: 125000, transactions: 3200, newUsers: 450 },
  { month: 'Feb', revenue: 148000, transactions: 3800, newUsers: 520 },
  { month: 'Mar', revenue: 175000, transactions: 4200, newUsers: 680 },
  { month: 'Apr', revenue: 162000, transactions: 3900, newUsers: 580 },
  { month: 'May', revenue: 198000, transactions: 4800, newUsers: 720 },
  { month: 'Jun', revenue: 215000, transactions: 5200, newUsers: 850 },
  { month: 'Jul', revenue: 245000, transactions: 5800, newUsers: 920 },
  { month: 'Aug', revenue: 268000, transactions: 6200, newUsers: 1050 },
  { month: 'Sep', revenue: 285000, transactions: 6800, newUsers: 1150 },
  { month: 'Oct', revenue: 312000, transactions: 7500, newUsers: 1280 },
  { month: 'Nov', revenue: 345000, transactions: 8200, newUsers: 1420 },
  { month: 'Dec', revenue: 398000, transactions: 9500, newUsers: 1680 },
];

const tierDistribution = [
  { name: 'Bronze', value: 12500, color: '#cd7f32' },
  { name: 'Silver', value: 8200, color: '#9ca3af' },
  { name: 'Gold', value: 4500, color: '#fbbf24' },
  { name: 'Platinum', value: 1800, color: '#1e3a5f' },
];

const rewardCategoryData = [
  { category: 'Beverages', redeemed: 4500, revenue: 180000 },
  { category: 'Food', redeemed: 3200, revenue: 128000 },
  { category: 'Merchandise', redeemed: 1800, revenue: 72000 },
  { category: 'Experiences', redeemed: 850, revenue: 68000 },
  { category: 'Promotions', redeemed: 2100, revenue: 42000 },
];

const dailyActivityData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  loads: Math.floor(Math.random() * 500) + 200,
  purchases: Math.floor(Math.random() * 800) + 400,
  redemptions: Math.floor(Math.random() * 300) + 100,
}));

const topProducts = [
  { name: 'Signature Latte', redeemed: 1250, points: 150, growth: 12.5 },
  { name: 'Thai Milk Tea', redeemed: 980, points: 120, growth: 8.3 },
  { name: 'Birthday Reward', redeemed: 750, points: 0, growth: 15.2 },
  { name: 'Pastry Box', redeemed: 620, points: 200, growth: -3.1 },
  { name: 'Branded Tumbler', redeemed: 480, points: 500, growth: 22.4 },
];

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('year');
  const [reportType, setReportType] = useState('overview');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('th-TH').format(value);
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(2876000),
      change: 23.5,
      icon: CreditCard,
      color: 'primary',
    },
    {
      title: 'Total Users',
      value: formatNumber(27000),
      change: 18.2,
      icon: Users,
      color: 'secondary',
    },
    {
      title: 'Rewards Redeemed',
      value: formatNumber(12450),
      change: 32.1,
      icon: Gift,
      color: 'success',
    },
    {
      title: 'Points Issued',
      value: formatNumber(1850000),
      change: 15.8,
      icon: Star,
      color: 'warning',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Comprehensive business insights and metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'revenue', label: 'Revenue', icon: LineChart },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'rewards', label: 'Rewards', icon: Gift },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
              reportType === tab.id
                ? 'text-primary-900 border-primary-900'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <p className="text-sm text-gray-500">Monthly revenue and transactions</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-500" />
                <span className="text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary-500" />
                <span className="text-gray-600">Transactions</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis 
                  yAxisId="left" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `฿${value/1000}k`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e3a5f',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value) : formatNumber(value),
                    name === 'revenue' ? 'Revenue' : 'Transactions'
                  ]}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  fill="#1e3a5f"
                  fillOpacity={0.1}
                  stroke="#1e3a5f"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="transactions"
                  stroke="#c9a227"
                  strokeWidth={2}
                  dot={{ fill: '#c9a227', strokeWidth: 0, r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Tier Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">User Distribution</h3>
              <p className="text-sm text-gray-500">Users by loyalty tier</p>
            </div>
          </div>
          <div className="h-80 flex items-center">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPie>
                  <Pie
                    data={tierDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {tierDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e3a5f',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value) => [formatNumber(value), 'Users']}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-4">
              {tierDistribution.map((tier) => (
                <div key={tier.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="font-medium text-gray-700">{tier.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatNumber(tier.value)}</p>
                    <p className="text-xs text-gray-500">
                      {((tier.value / 27000) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Activity</h3>
              <p className="text-sm text-gray-500">Transaction types over the past 30 days</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  tickFormatter={(value) => value % 5 === 0 ? value : ''}
                />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e3a5f',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Bar dataKey="loads" name="Loads" fill="#1e3a5f" radius={[2, 2, 0, 0]} />
                <Bar dataKey="purchases" name="Purchases" fill="#c9a227" radius={[2, 2, 0, 0]} />
                <Bar dataKey="redemptions" name="Redemptions" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reward Categories Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Reward Categories</h3>
              <p className="text-sm text-gray-500">Performance by category</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rewardCategoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `฿${value/1000}k`}
                />
                <YAxis 
                  type="category" 
                  dataKey="category" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e3a5f',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value) : formatNumber(value),
                    name === 'revenue' ? 'Revenue' : 'Redeemed'
                  ]}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#1e3a5f" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Rewards</h3>
            <p className="text-sm text-gray-500">Most redeemed rewards this period</p>
          </div>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Reward</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Points Cost</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Redeemed</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Growth</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-mono ${product.points === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                      {product.points === 0 ? 'Free' : `${product.points} ★`}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-900">
                    {formatNumber(product.redeemed)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className={`inline-flex items-center gap-1 ${
                      product.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.growth > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-medium">{Math.abs(product.growth)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Revenue Report', desc: 'Financial summary with trends', format: 'XLSX' },
            { title: 'User Analytics', desc: 'User behavior and demographics', format: 'PDF' },
            { title: 'Reward Performance', desc: 'Redemption and popularity data', format: 'CSV' },
            { title: 'Transaction Log', desc: 'Complete transaction history', format: 'CSV' },
          ].map((report, index) => (
            <button
              key={index}
              className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
            >
              <FileText className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{report.title}</p>
                <p className="text-sm text-gray-500">{report.desc}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                  {report.format}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

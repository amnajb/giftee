import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Search,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  XCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import DataTable from '../common/DataTable';
import Modal from '../common/Modal';
import StatCard from '../common/StatCard';

// Demo transaction data
const demoTransactions = [
  {
    id: 'TXN-001',
    type: 'load',
    amount: 500,
    pointsEarned: 5,
    userId: 'user1',
    userName: 'สมชาย ใจดี',
    cardNumber: '**** 1234',
    cashierId: 'cashier1',
    cashierName: 'วิชัย พนักงาน',
    status: 'completed',
    createdAt: '2026-01-11T10:30:00',
  },
  {
    id: 'TXN-002',
    type: 'purchase',
    amount: 85,
    pointsEarned: 2,
    userId: 'user2',
    userName: 'สุดา สวยงาม',
    cardNumber: '**** 5678',
    cashierId: 'cashier1',
    cashierName: 'วิชัย พนักงาน',
    status: 'completed',
    createdAt: '2026-01-11T10:15:00',
  },
  {
    id: 'TXN-003',
    type: 'redemption',
    amount: 0,
    pointsEarned: -50,
    userId: 'user1',
    userName: 'สมชาย ใจดี',
    cardNumber: '**** 1234',
    cashierId: 'cashier2',
    cashierName: 'มานี แคชเชียร์',
    status: 'completed',
    rewardName: 'Free Americano',
    createdAt: '2026-01-11T09:45:00',
  },
  {
    id: 'TXN-004',
    type: 'load',
    amount: 1000,
    pointsEarned: 10,
    userId: 'user3',
    userName: 'กิตติ ดีมาก',
    cardNumber: '**** 9012',
    cashierId: 'cashier1',
    cashierName: 'วิชัย พนักงาน',
    status: 'completed',
    createdAt: '2026-01-11T09:30:00',
  },
  {
    id: 'TXN-005',
    type: 'purchase',
    amount: 120,
    pointsEarned: 3,
    userId: 'user4',
    userName: 'พิมพ์ใจ รักสัตว์',
    cardNumber: '**** 3456',
    cashierId: 'cashier2',
    cashierName: 'มานี แคชเชียร์',
    status: 'completed',
    createdAt: '2026-01-11T09:00:00',
  },
  {
    id: 'TXN-006',
    type: 'refund',
    amount: -200,
    pointsEarned: -2,
    userId: 'user2',
    userName: 'สุดา สวยงาม',
    cardNumber: '**** 5678',
    cashierId: 'cashier1',
    cashierName: 'วิชัย พนักงาน',
    status: 'completed',
    reason: 'Duplicate charge',
    createdAt: '2026-01-10T16:30:00',
  },
  {
    id: 'TXN-007',
    type: 'purchase',
    amount: 250,
    pointsEarned: 5,
    userId: 'user1',
    userName: 'สมชาย ใจดี',
    cardNumber: '**** 1234',
    cashierId: 'cashier1',
    cashierName: 'วิชัย พนักงาน',
    status: 'voided',
    voidReason: 'Customer cancelled',
    createdAt: '2026-01-10T15:00:00',
  },
  {
    id: 'TXN-008',
    type: 'load',
    amount: 300,
    pointsEarned: 3,
    userId: 'user5',
    userName: 'นภา ทอง',
    cardNumber: '**** 7890',
    cashierId: 'cashier2',
    cashierName: 'มานี แคชเชียร์',
    status: 'completed',
    createdAt: '2026-01-10T14:00:00',
  },
];

// Chart data
const revenueChartData = [
  { date: 'Jan 5', revenue: 12500, transactions: 45 },
  { date: 'Jan 6', revenue: 15200, transactions: 52 },
  { date: 'Jan 7', revenue: 18900, transactions: 61 },
  { date: 'Jan 8', revenue: 14300, transactions: 48 },
  { date: 'Jan 9', revenue: 21500, transactions: 72 },
  { date: 'Jan 10', revenue: 19800, transactions: 65 },
  { date: 'Jan 11', revenue: 16400, transactions: 54 },
];

const transactionTypeData = [
  { name: 'Purchases', value: 45, color: '#1e3a5f' },
  { name: 'Loads', value: 35, color: '#c9a227' },
  { name: 'Redemptions', value: 15, color: '#10b981' },
  { name: 'Refunds', value: 5, color: '#ef4444' },
];

const hourlyData = [
  { hour: '8am', transactions: 12 },
  { hour: '9am', transactions: 28 },
  { hour: '10am', transactions: 35 },
  { hour: '11am', transactions: 42 },
  { hour: '12pm', transactions: 55 },
  { hour: '1pm', transactions: 48 },
  { hour: '2pm', transactions: 38 },
  { hour: '3pm', transactions: 45 },
  { hour: '4pm', transactions: 52 },
  { hour: '5pm', transactions: 62 },
  { hour: '6pm', transactions: 58 },
  { hour: '7pm', transactions: 35 },
];

const typeConfig = {
  load: { color: 'bg-green-100 text-green-700', icon: ArrowUpRight, label: 'Load' },
  purchase: { color: 'bg-blue-100 text-blue-700', icon: CreditCard, label: 'Purchase' },
  redemption: { color: 'bg-purple-100 text-purple-700', icon: Receipt, label: 'Redemption' },
  refund: { color: 'bg-red-100 text-red-700', icon: ArrowDownRight, label: 'Refund' },
};

const statusConfig = {
  completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Completed' },
  pending: { color: 'bg-amber-100 text-amber-700', icon: Clock, label: 'Pending' },
  voided: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Voided' },
};

const TransactionReports = () => {
  const [transactions, setTransactions] = useState(demoTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch =
        searchQuery === '' ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.cardNumber.includes(searchQuery);

      const matchesType = typeFilter === 'all' || txn.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;

      let matchesDate = true;
      if (dateRange.start) {
        matchesDate = matchesDate && new Date(txn.createdAt) >= new Date(dateRange.start);
      }
      if (dateRange.end) {
        matchesDate = matchesDate && new Date(txn.createdAt) <= new Date(dateRange.end + 'T23:59:59');
      }

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });
  }, [transactions, searchQuery, typeFilter, statusFilter, dateRange]);

  // Calculate stats
  const stats = useMemo(() => {
    const completed = transactions.filter((t) => t.status === 'completed');
    const totalRevenue = completed
      .filter((t) => t.type === 'load')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalPurchases = completed
      .filter((t) => t.type === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalTransactions = completed.length;
    const avgTransaction = totalTransactions > 0 ? (totalRevenue + totalPurchases) / totalTransactions : 0;

    return { totalRevenue, totalPurchases, totalTransactions, avgTransaction };
  }, [transactions]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Transaction ID',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm font-medium text-gray-900">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ getValue }) => {
          const type = typeConfig[getValue()];
          const Icon = type?.icon || Receipt;
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${type?.color}`}>
              <Icon className="w-3.5 h-3.5" />
              {type?.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'userName',
        header: 'Customer',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-gray-900">{row.original.userName}</p>
            <p className="text-sm text-gray-500">{row.original.cardNumber}</p>
          </div>
        ),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ getValue, row }) => {
          const amount = getValue();
          const isPositive = amount >= 0 && row.original.type !== 'refund';
          return (
            <span className={`font-semibold ${isPositive ? 'text-gray-900' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}฿{Math.abs(amount).toLocaleString()}
            </span>
          );
        },
      },
      {
        accessorKey: 'pointsEarned',
        header: 'Points',
        cell: ({ getValue }) => {
          const points = getValue();
          return (
            <span className={`font-medium ${points >= 0 ? 'text-secondary-600' : 'text-red-600'}`}>
              {points >= 0 ? '+' : ''}{points} ★
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = statusConfig[getValue()];
          const Icon = status?.icon || CheckCircle;
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status?.color}`}>
              <Icon className="w-3.5 h-3.5" />
              {status?.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Date & Time',
        cell: ({ getValue }) => {
          const date = new Date(getValue());
          return (
            <div>
              <p className="text-gray-900">{date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</p>
              <p className="text-sm text-gray-500">{date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTransaction(row.original);
              setIsDetailModalOpen(true);
            }}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
        ),
      },
    ],
    []
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? `฿${entry.value.toLocaleString()}` : entry.value}
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
          <h1 className="text-2xl font-bold text-gray-900">Transaction Reports</h1>
          <p className="text-gray-500 mt-1">Monitor and analyze transaction data</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Loads"
          value={`฿${stats.totalRevenue.toLocaleString()}`}
          change={15}
          icon={TrendingUp}
          iconColor="success"
        />
        <StatCard
          title="Total Purchases"
          value={`฿${stats.totalPurchases.toLocaleString()}`}
          change={8}
          icon={CreditCard}
          iconColor="primary"
        />
        <StatCard
          title="Transactions"
          value={stats.totalTransactions.toLocaleString()}
          change={12}
          icon={Receipt}
          iconColor="info"
        />
        <StatCard
          title="Avg. Transaction"
          value={`฿${stats.avgTransaction.toFixed(0)}`}
          change={-3}
          icon={DollarSign}
          iconColor="secondary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `฿${v / 1000}k`} />
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

        {/* Transaction Types Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Types</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={transactionTypeData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {transactionTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {transactionTypeData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Distribution Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Transaction Distribution</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="transactions" fill="#c9a227" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, customer, or card..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            >
              <option value="all">All Types</option>
              <option value="load">Load</option>
              <option value="purchase">Purchase</option>
              <option value="redemption">Redemption</option>
              <option value="refund">Refund</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="voided">Voided</option>
            </select>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-sm"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-sm"
              />
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setStatusFilter('all');
                setDateRange({ start: '', end: '' });
              }}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredTransactions}
        columns={columns}
        pageSize={10}
        emptyMessage="No transactions found"
        onRowClick={(txn) => {
          setSelectedTransaction(txn);
          setIsDetailModalOpen(true);
        }}
      />

      {/* Transaction Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTransaction(null);
        }}
        title="Transaction Details"
        size="md"
      >
        {selectedTransaction && <TransactionDetail transaction={selectedTransaction} />}
      </Modal>
    </div>
  );
};

// Transaction Detail Component
const TransactionDetail = ({ transaction }) => {
  const type = typeConfig[transaction.type];
  const status = statusConfig[transaction.status];
  const TypeIcon = type?.icon || Receipt;
  const StatusIcon = status?.icon || CheckCircle;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <p className="text-sm text-gray-500">Transaction ID</p>
          <p className="text-xl font-mono font-bold text-gray-900">{transaction.id}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status?.color}`}>
          <StatusIcon className="w-4 h-4" />
          {status?.label}
        </span>
      </div>

      {/* Transaction Type & Amount */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type?.color}`}>
              <TypeIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{type?.label}</p>
              <p className="text-2xl font-bold text-gray-900">
                {transaction.amount >= 0 ? '+' : ''}฿{Math.abs(transaction.amount).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Points</p>
            <p className={`text-xl font-bold ${transaction.pointsEarned >= 0 ? 'text-secondary-600' : 'text-red-600'}`}>
              {transaction.pointsEarned >= 0 ? '+' : ''}{transaction.pointsEarned} ★
            </p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Customer</p>
          <p className="font-medium text-gray-900">{transaction.userName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Card Number</p>
          <p className="font-medium font-mono text-gray-900">{transaction.cardNumber}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Processed By</p>
          <p className="font-medium text-gray-900">{transaction.cashierName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Date & Time</p>
          <p className="font-medium text-gray-900">
            {new Date(transaction.createdAt).toLocaleString('th-TH')}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      {transaction.rewardName && (
        <div className="bg-purple-50 rounded-xl p-4">
          <p className="text-sm text-purple-600 mb-1">Reward Redeemed</p>
          <p className="font-medium text-purple-900">{transaction.rewardName}</p>
        </div>
      )}

      {transaction.voidReason && (
        <div className="bg-red-50 rounded-xl p-4">
          <p className="text-sm text-red-600 mb-1">Void Reason</p>
          <p className="font-medium text-red-900">{transaction.voidReason}</p>
        </div>
      )}

      {transaction.reason && (
        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-sm text-amber-600 mb-1">Reason</p>
          <p className="font-medium text-amber-900">{transaction.reason}</p>
        </div>
      )}
    </div>
  );
};

export default TransactionReports;

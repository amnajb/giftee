import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Shield,
  ShieldOff,
  Mail,
  Phone,
  Star,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import DataTable from '../common/DataTable';
import Modal, { ConfirmDialog } from '../common/Modal';
import StatCard from '../common/StatCard';

// Demo data for users
const demoUsers = [
  {
    id: '1',
    displayName: 'สมชาย ใจดี',
    email: 'somchai@email.com',
    phone: '081-234-5678',
    role: 'customer',
    tier: 'gold',
    totalPoints: 2450,
    lifetimePoints: 8920,
    balance: 1250.0,
    isActive: true,
    lastLogin: '2026-01-10T14:30:00',
    createdAt: '2024-06-15T08:00:00',
  },
  {
    id: '2',
    displayName: 'สุดา สวยงาม',
    email: 'suda@email.com',
    phone: '089-876-5432',
    role: 'customer',
    tier: 'platinum',
    totalPoints: 5680,
    lifetimePoints: 15420,
    balance: 3500.0,
    isActive: true,
    lastLogin: '2026-01-11T09:15:00',
    createdAt: '2023-11-20T10:30:00',
  },
  {
    id: '3',
    displayName: 'วิชัย พนักงาน',
    email: 'wichai@giftee.co.th',
    phone: '082-111-2222',
    role: 'cashier',
    tier: 'bronze',
    totalPoints: 0,
    lifetimePoints: 0,
    balance: 0,
    isActive: true,
    lastLogin: '2026-01-11T08:00:00',
    createdAt: '2024-01-10T09:00:00',
  },
  {
    id: '4',
    displayName: 'นภา ทอง',
    email: 'napa@email.com',
    phone: '086-333-4444',
    role: 'customer',
    tier: 'silver',
    totalPoints: 890,
    lifetimePoints: 3240,
    balance: 750.5,
    isActive: false,
    lastLogin: '2025-12-28T16:45:00',
    createdAt: '2024-03-05T14:20:00',
  },
  {
    id: '5',
    displayName: 'Admin Master',
    email: 'admin@giftee.co.th',
    phone: '080-000-0001',
    role: 'admin',
    tier: 'platinum',
    totalPoints: 0,
    lifetimePoints: 0,
    balance: 0,
    isActive: true,
    lastLogin: '2026-01-11T10:00:00',
    createdAt: '2023-01-01T00:00:00',
  },
  {
    id: '6',
    displayName: 'พิมพ์ใจ รักสัตว์',
    email: 'pimjai@email.com',
    phone: '091-555-6666',
    role: 'customer',
    tier: 'bronze',
    totalPoints: 120,
    lifetimePoints: 450,
    balance: 200.0,
    isActive: true,
    lastLogin: '2026-01-09T11:20:00',
    createdAt: '2025-09-12T16:00:00',
  },
  {
    id: '7',
    displayName: 'กิตติ ดีมาก',
    email: 'kitti@email.com',
    phone: '083-777-8888',
    role: 'customer',
    tier: 'gold',
    totalPoints: 1890,
    lifetimePoints: 6780,
    balance: 2100.0,
    isActive: true,
    lastLogin: '2026-01-10T20:30:00',
    createdAt: '2024-02-28T12:15:00',
  },
  {
    id: '8',
    displayName: 'มานี แคชเชียร์',
    email: 'manee@giftee.co.th',
    phone: '084-999-0000',
    role: 'cashier',
    tier: 'bronze',
    totalPoints: 0,
    lifetimePoints: 0,
    balance: 0,
    isActive: true,
    lastLogin: '2026-01-11T07:45:00',
    createdAt: '2024-08-01T08:30:00',
  },
];

const tierConfig = {
  bronze: { color: 'bg-amber-700', textColor: 'text-white', label: 'Bronze' },
  silver: { color: 'bg-gray-400', textColor: 'text-white', label: 'Silver' },
  gold: { color: 'bg-yellow-500', textColor: 'text-yellow-900', label: 'Gold' },
  platinum: { color: 'bg-gradient-to-r from-gray-300 to-gray-100', textColor: 'text-gray-800', label: 'Platinum' },
};

const roleConfig = {
  customer: { color: 'bg-blue-100 text-blue-700', label: 'Customer' },
  cashier: { color: 'bg-purple-100 text-purple-700', label: 'Cashier' },
  admin: { color: 'bg-red-100 text-red-700', label: 'Admin' },
};

const UserManagement = () => {
  const [users, setUsers] = useState(demoUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchQuery === '' ||
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery);

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesTier = tierFilter === 'all' || user.tier === tierFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'inactive' && !user.isActive);

      return matchesSearch && matchesRole && matchesTier && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, tierFilter, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive).length;
    const customers = users.filter((u) => u.role === 'customer').length;
    const goldPlatinum = users.filter((u) => u.tier === 'gold' || u.tier === 'platinum').length;
    return { totalUsers, activeUsers, customers, goldPlatinum };
  }, [users]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'displayName',
        header: 'User',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-semibold">
                {row.original.displayName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{row.original.displayName}</p>
              <p className="text-sm text-gray-500">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ getValue }) => {
          const role = getValue();
          const config = roleConfig[role];
          return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'tier',
        header: 'Tier',
        cell: ({ getValue }) => {
          const tier = getValue();
          const config = tierConfig[tier];
          return (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.color} ${config.textColor}`}
            >
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'totalPoints',
        header: 'Points',
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-secondary-500" />
            <span className="font-medium">{getValue().toLocaleString()}</span>
          </div>
        ),
      },
      {
        accessorKey: 'balance',
        header: 'Balance',
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-900">฿{getValue().toLocaleString()}</span>
        ),
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ getValue }) => (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              getValue() ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {getValue() ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" /> Active
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5" /> Inactive
              </>
            )}
          </span>
        ),
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last Login',
        cell: ({ getValue }) => {
          const date = new Date(getValue());
          return (
            <span className="text-gray-500">
              {date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(row.original);
                setIsEditModalOpen(true);
              }}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Edit user"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleUserStatus(row.original.id);
              }}
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title={row.original.isActive ? 'Deactivate user' : 'Activate user'}
            >
              {row.original.isActive ? (
                <ShieldOff className="w-4 h-4" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(row.original);
                setIsDeleteDialogOpen(true);
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete user"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user))
    );
  };

  const handleDelete = () => {
    if (selectedUser) {
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage customers, cashiers, and administrators</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change={12}
          icon={Users}
          iconColor="primary"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          change={8}
          icon={CheckCircle}
          iconColor="success"
        />
        <StatCard
          title="Customers"
          value={stats.customers.toLocaleString()}
          change={15}
          icon={Users}
          iconColor="info"
        />
        <StatCard
          title="Gold & Platinum"
          value={stats.goldPlatinum.toLocaleString()}
          change={22}
          icon={Star}
          iconColor="secondary"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            >
              <option value="all">All Tiers</option>
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
                setTierFilter('all');
                setStatusFilter('all');
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
        data={filteredUsers}
        columns={columns}
        pageSize={10}
        loading={loading}
        emptyMessage="No users found matching your criteria"
        onRowClick={(user) => {
          setSelectedUser(user);
          setIsEditModalOpen(true);
        }}
      />

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
        size="lg"
      >
        <UserForm
          onSubmit={(data) => {
            const newUser = {
              id: Date.now().toString(),
              ...data,
              totalPoints: 0,
              lifetimePoints: 0,
              balance: 0,
              isActive: true,
              lastLogin: null,
              createdAt: new Date().toISOString(),
            };
            setUsers((prev) => [newUser, ...prev]);
            setIsCreateModalOpen(false);
          }}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title="Edit User"
        size="lg"
      >
        {selectedUser && (
          <UserForm
            initialData={selectedUser}
            onSubmit={(data) => {
              setUsers((prev) =>
                prev.map((user) => (user.id === selectedUser.id ? { ...user, ...data } : user))
              );
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.displayName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

// User Form Component
const UserForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    displayName: initialData?.displayName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    role: initialData?.role || 'customer',
    tier: initialData?.tier || 'bronze',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
              placeholder="user@example.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
              placeholder="08X-XXX-XXXX"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          >
            <option value="customer">Customer</option>
            <option value="cashier">Cashier</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {formData.role === 'customer' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Loyalty Tier</label>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(tierConfig).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, tier: key }))}
                  className={`py-2.5 px-4 rounded-lg border-2 font-medium transition-all ${
                    formData.tier === key
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
        >
          {initialData ? 'Save Changes' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default UserManagement;

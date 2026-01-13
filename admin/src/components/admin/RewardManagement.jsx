import React, { useState, useMemo } from 'react';
import {
  Gift,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Tag,
  Package,
  TrendingUp,
  Image,
  MoreVertical,
  Copy,
  RefreshCw,
  Coffee,
  ShoppingBag,
  Ticket,
  Sparkles,
} from 'lucide-react';
import DataTable from '../common/DataTable';
import Modal, { ConfirmDialog } from '../common/Modal';
import StatCard from '../common/StatCard';

// Demo rewards data
const demoRewards = [
  {
    id: '1',
    name: 'Free Americano',
    description: 'Get a free regular Americano (hot or iced)',
    category: 'beverages',
    pointsCost: 50,
    quantity: 500,
    redeemed: 234,
    isActive: true,
    tier: 'bronze',
    imageUrl: '/rewards/americano.jpg',
    validFrom: '2026-01-01',
    validUntil: '2026-06-30',
    createdAt: '2025-12-01T10:00:00',
  },
  {
    id: '2',
    name: 'Signature Latte',
    description: 'Free signature latte of your choice',
    category: 'beverages',
    pointsCost: 80,
    quantity: 300,
    redeemed: 156,
    isActive: true,
    tier: 'silver',
    imageUrl: '/rewards/latte.jpg',
    validFrom: '2026-01-01',
    validUntil: '2026-06-30',
    createdAt: '2025-12-01T10:00:00',
  },
  {
    id: '3',
    name: 'Croissant',
    description: 'Fresh butter croissant',
    category: 'food',
    pointsCost: 40,
    quantity: 200,
    redeemed: 89,
    isActive: true,
    tier: 'bronze',
    imageUrl: '/rewards/croissant.jpg',
    validFrom: '2026-01-01',
    validUntil: '2026-03-31',
    createdAt: '2025-12-15T14:30:00',
  },
  {
    id: '4',
    name: 'Premium Coffee Beans (200g)',
    description: 'Take home our signature house blend',
    category: 'merchandise',
    pointsCost: 200,
    quantity: 100,
    redeemed: 45,
    isActive: true,
    tier: 'gold',
    imageUrl: '/rewards/beans.jpg',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    createdAt: '2025-11-20T09:00:00',
  },
  {
    id: '5',
    name: 'Tumbler Set',
    description: 'Exclusive Giftee branded tumbler with lid',
    category: 'merchandise',
    pointsCost: 350,
    quantity: 50,
    redeemed: 28,
    isActive: true,
    tier: 'platinum',
    imageUrl: '/rewards/tumbler.jpg',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    createdAt: '2025-11-15T11:00:00',
  },
  {
    id: '6',
    name: 'Double Points Day',
    description: 'Earn double points on your next purchase',
    category: 'promotions',
    pointsCost: 100,
    quantity: -1,
    redeemed: 567,
    isActive: false,
    tier: 'gold',
    imageUrl: '/rewards/double.jpg',
    validFrom: '2025-12-01',
    validUntil: '2025-12-31',
    createdAt: '2025-11-01T08:00:00',
  },
  {
    id: '7',
    name: 'Birthday Cake Slice',
    description: 'Special birthday celebration treat',
    category: 'food',
    pointsCost: 60,
    quantity: 150,
    redeemed: 42,
    isActive: true,
    tier: 'silver',
    imageUrl: '/rewards/cake.jpg',
    validFrom: '2026-01-01',
    validUntil: '2026-06-30',
    createdAt: '2025-12-20T15:00:00',
  },
  {
    id: '8',
    name: 'VIP Lounge Access',
    description: 'One-day access to exclusive VIP lounge',
    category: 'experiences',
    pointsCost: 500,
    quantity: 20,
    redeemed: 8,
    isActive: true,
    tier: 'platinum',
    imageUrl: '/rewards/vip.jpg',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    createdAt: '2025-12-10T12:00:00',
  },
];

const categoryConfig = {
  beverages: { icon: Coffee, color: 'bg-amber-100 text-amber-700', label: 'Beverages' },
  food: { icon: ShoppingBag, color: 'bg-green-100 text-green-700', label: 'Food' },
  merchandise: { icon: Package, color: 'bg-blue-100 text-blue-700', label: 'Merchandise' },
  promotions: { icon: Tag, color: 'bg-purple-100 text-purple-700', label: 'Promotions' },
  experiences: { icon: Sparkles, color: 'bg-pink-100 text-pink-700', label: 'Experiences' },
};

const tierConfig = {
  bronze: { color: 'tier-bronze', label: 'Bronze' },
  silver: { color: 'tier-silver', label: 'Silver' },
  gold: { color: 'tier-gold', label: 'Gold' },
  platinum: { color: 'tier-platinum', label: 'Platinum' },
};

const RewardManagement = () => {
  const [rewards, setRewards] = useState(demoRewards);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filter rewards
  const filteredRewards = useMemo(() => {
    return rewards.filter((reward) => {
      const matchesSearch =
        searchQuery === '' ||
        reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reward.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || reward.category === categoryFilter;
      const matchesTier = tierFilter === 'all' || reward.tier === tierFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && reward.isActive) ||
        (statusFilter === 'inactive' && !reward.isActive);

      return matchesSearch && matchesCategory && matchesTier && matchesStatus;
    });
  }, [rewards, searchQuery, categoryFilter, tierFilter, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalRewards = rewards.length;
    const activeRewards = rewards.filter((r) => r.isActive).length;
    const totalRedeemed = rewards.reduce((sum, r) => sum + r.redeemed, 0);
    const lowStock = rewards.filter((r) => r.quantity > 0 && r.quantity - r.redeemed < 20).length;
    return { totalRewards, activeRewards, totalRedeemed, lowStock };
  }, [rewards]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Reward',
        cell: ({ row }) => {
          const category = categoryConfig[row.original.category];
          const CategoryIcon = category?.icon || Gift;
          return (
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${category?.color || 'bg-gray-100 text-gray-600'}`}
              >
                <CategoryIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{row.original.name}</p>
                <p className="text-sm text-gray-500 truncate max-w-[200px]">
                  {row.original.description}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ getValue }) => {
          const category = categoryConfig[getValue()];
          return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${category?.color}`}>
              {category?.label || getValue()}
            </span>
          );
        },
      },
      {
        accessorKey: 'pointsCost',
        header: 'Points',
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-secondary-500" />
            <span className="font-semibold text-gray-900">{getValue()}</span>
          </div>
        ),
      },
      {
        accessorKey: 'tier',
        header: 'Min. Tier',
        cell: ({ getValue }) => {
          const tier = tierConfig[getValue()];
          return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tier?.color}`}>
              {tier?.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'quantity',
        header: 'Stock',
        cell: ({ row }) => {
          const quantity = row.original.quantity;
          const redeemed = row.original.redeemed;
          const remaining = quantity === -1 ? '∞' : quantity - redeemed;
          const isLow = quantity > 0 && remaining < 20;
          return (
            <div>
              <span className={`font-medium ${isLow ? 'text-amber-600' : 'text-gray-900'}`}>
                {remaining}
              </span>
              {quantity !== -1 && (
                <span className="text-gray-400 text-sm"> / {quantity}</span>
              )}
              {isLow && <span className="ml-2 text-xs text-amber-600">Low</span>}
            </div>
          );
        },
      },
      {
        accessorKey: 'redeemed',
        header: 'Redeemed',
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue().toLocaleString()}</span>
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
                <Eye className="w-3.5 h-3.5" /> Active
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Hidden
              </>
            )}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReward(row.original);
                setIsEditModalOpen(true);
              }}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Edit reward"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateReward(row.original);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Duplicate reward"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleRewardStatus(row.original.id);
              }}
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title={row.original.isActive ? 'Hide reward' : 'Show reward'}
            >
              {row.original.isActive ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReward(row.original);
                setIsDeleteDialogOpen(true);
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete reward"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const toggleRewardStatus = (rewardId) => {
    setRewards((prev) =>
      prev.map((reward) =>
        reward.id === rewardId ? { ...reward, isActive: !reward.isActive } : reward
      )
    );
  };

  const duplicateReward = (reward) => {
    const newReward = {
      ...reward,
      id: Date.now().toString(),
      name: `${reward.name} (Copy)`,
      redeemed: 0,
      createdAt: new Date().toISOString(),
    };
    setRewards((prev) => [newReward, ...prev]);
  };

  const handleDelete = () => {
    if (selectedReward) {
      setRewards((prev) => prev.filter((reward) => reward.id !== selectedReward.id));
      setIsDeleteDialogOpen(false);
      setSelectedReward(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reward Management</h1>
          <p className="text-gray-500 mt-1">Create and manage loyalty rewards</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reward</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Rewards"
          value={stats.totalRewards}
          icon={Gift}
          iconColor="primary"
        />
        <StatCard
          title="Active Rewards"
          value={stats.activeRewards}
          icon={Eye}
          iconColor="success"
        />
        <StatCard
          title="Total Redeemed"
          value={stats.totalRedeemed.toLocaleString()}
          change={18}
          icon={TrendingUp}
          iconColor="secondary"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStock}
          icon={Package}
          iconColor={stats.lowStock > 0 ? 'warning' : 'info'}
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
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            >
              <option value="all">All Categories</option>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            >
              <option value="all">All Tiers</option>
              {Object.entries(tierConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Hidden</option>
            </select>

            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
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
        data={filteredRewards}
        columns={columns}
        pageSize={10}
        emptyMessage="No rewards found"
        onRowClick={(reward) => {
          setSelectedReward(reward);
          setIsEditModalOpen(true);
        }}
      />

      {/* Create Reward Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Reward"
        size="lg"
      >
        <RewardForm
          onSubmit={(data) => {
            const newReward = {
              id: Date.now().toString(),
              ...data,
              redeemed: 0,
              createdAt: new Date().toISOString(),
            };
            setRewards((prev) => [newReward, ...prev]);
            setIsCreateModalOpen(false);
          }}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Reward Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReward(null);
        }}
        title="Edit Reward"
        size="lg"
      >
        {selectedReward && (
          <RewardForm
            initialData={selectedReward}
            onSubmit={(data) => {
              setRewards((prev) =>
                prev.map((reward) =>
                  reward.id === selectedReward.id ? { ...reward, ...data } : reward
                )
              );
              setIsEditModalOpen(false);
              setSelectedReward(null);
            }}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedReward(null);
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedReward(null);
        }}
        onConfirm={handleDelete}
        title="Delete Reward"
        message={`Are you sure you want to delete "${selectedReward?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

// Reward Form Component
const RewardForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'beverages',
    pointsCost: initialData?.pointsCost || 50,
    quantity: initialData?.quantity || 100,
    tier: initialData?.tier || 'bronze',
    isActive: initialData?.isActive ?? true,
    validFrom: initialData?.validFrom || new Date().toISOString().split('T')[0],
    validUntil: initialData?.validUntil || '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Reward Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            placeholder="e.g., Free Americano"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
            placeholder="Describe the reward..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          >
            {Object.entries(categoryConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Points Cost</label>
          <div className="relative">
            <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-500" />
            <input
              type="number"
              name="pointsCost"
              value={formData.pointsCost}
              onChange={handleChange}
              min={1}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Quantity (-1 for unlimited)
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min={-1}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum Tier</label>
          <select
            name="tier"
            value={formData.tier}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          >
            {Object.entries(tierConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Valid From</label>
          <input
            type="date"
            name="validFrom"
            value={formData.validFrom}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Valid Until</label>
          <input
            type="date"
            name="validUntil"
            value={formData.validUntil}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Active (visible in rewards catalog)
            </span>
          </label>
        </div>
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
          {initialData ? 'Save Changes' : 'Create Reward'}
        </button>
      </div>
    </form>
  );
};

export default RewardManagement;

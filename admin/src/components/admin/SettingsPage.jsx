import React, { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Gift,
  Store,
  Mail,
  Globe,
  Palette,
  Save,
  Upload,
  Eye,
  EyeOff,
  Check,
  X,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General
    storeName: 'Giftee Thailand',
    storeEmail: 'support@giftee.co.th',
    storePhone: '+66 2 123 4567',
    timezone: 'Asia/Bangkok',
    currency: 'THB',
    language: 'th',

    // Loyalty Program
    pointsPerBaht: 1,
    pointsExpiry: 365,
    welcomeBonus: 100,
    birthdayBonus: 200,
    tierThresholds: {
      silver: 500,
      gold: 2000,
      platinum: 5000,
    },

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: true,
    transactionAlerts: true,
    lowStockAlerts: true,

    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    ipWhitelist: '',

    // LINE Integration
    lineChannelId: '',
    lineChannelSecret: '',
    lineAccessToken: '',
    liffId: '',
  });

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTierChange = (tier, value) => {
    setSettings(prev => ({
      ...prev,
      tierThresholds: {
        ...prev.tierThresholds,
        [tier]: parseInt(value) || 0,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'loyalty', label: 'Loyalty Program', icon: Gift },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => handleChange('general', 'storeName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => handleChange('general', 'storeEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settings.storePhone}
                  onChange={(e) => handleChange('general', 'storePhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleChange('general', 'timezone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                  <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange('general', 'currency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="THB">Thai Baht (฿)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="SGD">Singapore Dollar (S$)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange('general', 'language', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="th">ภาษาไทย</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Gift className="w-10 h-10 text-primary-600" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload New Logo
                </button>
              </div>
            </div>
          </div>
        );

      case 'loyalty':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points per ฿1 Spent
                </label>
                <input
                  type="number"
                  value={settings.pointsPerBaht}
                  onChange={(e) => handleChange('loyalty', 'pointsPerBaht', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="1"
                />
                <p className="text-sm text-gray-500 mt-1">How many points customers earn per baht spent</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Expiry (Days)
                </label>
                <input
                  type="number"
                  value={settings.pointsExpiry}
                  onChange={(e) => handleChange('loyalty', 'pointsExpiry', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">0 = Points never expire</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Welcome Bonus (Points)
                </label>
                <input
                  type="number"
                  value={settings.welcomeBonus}
                  onChange={(e) => handleChange('loyalty', 'welcomeBonus', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday Bonus (Points)
                </label>
                <input
                  type="number"
                  value={settings.birthdayBonus}
                  onChange={(e) => handleChange('loyalty', 'birthdayBonus', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Tier Thresholds (Lifetime Points)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(settings.tierThresholds).map(([tier, threshold]) => (
                  <div key={tier} className="relative">
                    <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                      {tier}
                    </label>
                    <input
                      type="number"
                      value={threshold}
                      onChange={(e) => handleTierChange(tier, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      min="0"
                    />
                    <div
                      className={`absolute top-0 right-0 w-3 h-3 rounded-full ${
                        tier === 'silver' ? 'bg-gray-400' :
                        tier === 'gold' ? 'bg-yellow-400' :
                        'bg-primary-900'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Tier Benefits</p>
                <p className="mt-1">Configure individual tier benefits in the Rewards section. Customers automatically upgrade when they reach the threshold.</p>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Notification Channels</h4>
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={(e) => handleChange('notifications', item.key, e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${settings[item.key] ? 'bg-primary-600' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings[item.key] ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Alert Types</h4>
              {[
                { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Promotional emails to customers' },
                { key: 'transactionAlerts', label: 'Transaction Alerts', desc: 'Notify customers of transactions' },
                { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Alert when reward stock is low' },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={(e) => handleChange('notifications', item.key, e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${settings[item.key] ? 'bg-primary-600' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings[item.key] ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleChange('security', 'twoFactorAuth', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${settings.twoFactorAuth ? 'bg-primary-600' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                  </div>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (Minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Expiry (Days)
                </label>
                <input
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">0 = Passwords never expire</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IP Whitelist
              </label>
              <textarea
                value={settings.ipWhitelist}
                onChange={(e) => handleChange('security', 'ipWhitelist', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-24"
                placeholder="Enter IP addresses, one per line"
              />
              <p className="text-sm text-gray-500 mt-1">Leave empty to allow all IPs</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
              <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Security Recommendation</p>
                <p className="mt-1">We recommend enabling two-factor authentication and setting regular password expiry for all admin accounts.</p>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <h4 className="font-semibold text-green-900">LINE Integration</h4>
              </div>
              <p className="text-sm text-green-800">Connect your LINE Official Account for messaging and LIFF apps</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LINE Channel ID
                </label>
                <input
                  type="text"
                  value={settings.lineChannelId}
                  onChange={(e) => handleChange('integrations', 'lineChannelId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LINE Channel Secret
                </label>
                <input
                  type="password"
                  value={settings.lineChannelSecret}
                  onChange={(e) => handleChange('integrations', 'lineChannelSecret', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                  placeholder="••••••••••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LINE Access Token
                </label>
                <input
                  type="password"
                  value={settings.lineAccessToken}
                  onChange={(e) => handleChange('integrations', 'lineAccessToken', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                  placeholder="••••••••••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LIFF ID
                </label>
                <input
                  type="text"
                  value={settings.liffId}
                  onChange={(e) => handleChange('integrations', 'liffId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                  placeholder="1234567890-abcdefgh"
                />
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Check className="w-4 h-4" />
              Test Connection
            </button>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Brand Colors</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Primary', color: '#1e3a5f' },
                  { name: 'Secondary', color: '#c9a227' },
                  { name: 'Success', color: '#10b981' },
                  { name: 'Error', color: '#ef4444' },
                ].map((item) => (
                  <div key={item.name} className="text-center">
                    <div
                      className="w-full h-20 rounded-lg mb-2 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary-500 transition-all"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className="text-sm font-medium text-gray-700">{item.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{item.color}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Theme</h4>
              <div className="grid grid-cols-3 gap-4">
                {['Light', 'Dark', 'System'].map((theme) => (
                  <button
                    key={theme}
                    className={`p-4 border rounded-lg text-center transition-all ${
                      theme === 'Light'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium">{theme}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <Palette className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Custom Branding</p>
                <p className="mt-1">Contact support to customize your brand colors, fonts, and logo placement across all customer-facing interfaces.</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your application preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CashierDashboard from '../../components/cashier/CashierDashboard';
import ScanInterface from '../../components/cashier/ScanInterface';
import CustomerInfo from '../../components/cashier/CustomerInfo';
import TransactionForm from '../../components/cashier/TransactionForm';
import QuickActions from '../../components/cashier/QuickActions';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import cashierService from '../../services/cashier.service';
import { formatCurrency, formatDateTime, getTransactionTypeInfo } from '../../utils/formatters';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../utils/constants';
import './CashierHome.css';

const CashierHome = () => {
  const navigate = useNavigate();
  
  // State
  const [customer, setCustomer] = useState(null);
  const [card, setCard] = useState(null);
  const [summary, setSummary] = useState({});
  const [transactionType, setTransactionType] = useState(null); // 'load' or 'charge'
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [error, setError] = useState('');
  const [successModal, setSuccessModal] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);

  // Fetch daily summary on mount
  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const data = await cashierService.getDailySummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };

  // Handle QR scan
  const handleScan = useCallback(async (qrCode) => {
    setLookupLoading(true);
    setError('');
    
    try {
      const data = await cashierService.lookupByQR(qrCode);
      setCustomer(data.user);
      setCard(data.card);
    } catch (err) {
      console.error('Lookup failed:', err);
      setError(err.response?.data?.message || ERROR_MESSAGES.INVALID_QR);
    } finally {
      setLookupLoading(false);
    }
  }, []);

  // Handle manual card entry
  const handleManualEntry = useCallback(async (cardNumber) => {
    setLookupLoading(true);
    setError('');
    
    try {
      const data = await cashierService.lookupByCardNumber(cardNumber);
      setCustomer(data.user);
      setCard(data.card);
    } catch (err) {
      console.error('Lookup failed:', err);
      setError(err.response?.data?.message || ERROR_MESSAGES.CARD_NOT_FOUND);
    } finally {
      setLookupLoading(false);
    }
  }, []);

  // Clear customer
  const handleClearCustomer = useCallback(() => {
    setCustomer(null);
    setCard(null);
    setTransactionType(null);
    setError('');
  }, []);

  // Handle transaction submission
  const handleTransaction = useCallback(async (transactionData) => {
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (transactionType === 'load') {
        result = await cashierService.processLoad({
          cardId: card._id,
          ...transactionData,
        });
      } else {
        result = await cashierService.processCharge({
          cardId: card._id,
          ...transactionData,
        });
      }

      // Update card balance
      setCard((prev) => ({
        ...prev,
        balance: result.newBalance,
      }));

      // Update customer points
      if (result.pointsEarned) {
        setCustomer((prev) => ({
          ...prev,
          totalPoints: prev.totalPoints + result.pointsEarned,
        }));
      }

      // Show success modal
      setSuccessModal({
        type: transactionType,
        amount: transactionData.amount,
        newBalance: result.newBalance,
        pointsEarned: result.pointsEarned,
        transactionId: result.transactionId,
      });

      // Reset transaction type
      setTransactionType(null);

      // Refresh summary
      fetchSummary();
    } catch (err) {
      console.error('Transaction failed:', err);
      setError(err.response?.data?.message || ERROR_MESSAGES.TRANSACTION_FAILED);
    } finally {
      setLoading(false);
    }
  }, [transactionType, card]);

  // View recent transactions
  const handleViewTransactions = async () => {
    try {
      const data = await cashierService.getRecentTransactions(20);
      setRecentTransactions(data.transactions || []);
      setShowTransactionsModal(true);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  // Close success modal and start new transaction
  const handleNewTransaction = () => {
    setSuccessModal(null);
    handleClearCustomer();
  };

  // Continue with same customer
  const handleContinue = () => {
    setSuccessModal(null);
  };

  return (
    <CashierDashboard>
      <div className="cashier-home">
        {/* Quick Stats */}
        <QuickActions
          summary={summary}
          onViewTransactions={handleViewTransactions}
        />

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Main Content */}
        {lookupLoading ? (
          <LoadingSpinner text="กำลังค้นหา..." />
        ) : !customer ? (
          /* Scan Interface */
          <ScanInterface
            onScan={handleScan}
            onManualEntry={handleManualEntry}
            loading={lookupLoading}
          />
        ) : (
          /* Customer Found - Show Info and Actions */
          <div className="customer-section">
            <CustomerInfo
              customer={customer}
              card={card}
              onClear={handleClearCustomer}
            />

            {!transactionType ? (
              /* Action Buttons */
              <div className="action-buttons">
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => setTransactionType('load')}
                  disabled={!card?.isActive}
                  fullWidth
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  }
                >
                  เติมเงิน (Load)
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setTransactionType('charge')}
                  disabled={!card?.isActive || card?.balance <= 0}
                  fullWidth
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  }
                >
                  ชำระเงิน (Charge)
                </Button>
              </div>
            ) : (
              /* Transaction Form */
              <TransactionForm
                type={transactionType}
                balance={card?.balance || 0}
                onSubmit={handleTransaction}
                onCancel={() => setTransactionType(null)}
                loading={loading}
              />
            )}
          </div>
        )}

        {/* Success Modal */}
        <Modal
          isOpen={!!successModal}
          onClose={handleContinue}
          title={successModal?.type === 'load' ? 'เติมเงินสำเร็จ' : 'ชำระเงินสำเร็จ'}
          size="sm"
        >
          {successModal && (
            <div className="success-content">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              
              <div className="success-amount">
                <span className={successModal.type === 'load' ? 'text-success' : 'text-primary'}>
                  {successModal.type === 'load' ? '+' : '-'}
                  {formatCurrency(successModal.amount)}
                </span>
              </div>

              <div className="success-details">
                <div className="success-detail">
                  <span>ยอดคงเหลือใหม่</span>
                  <span>{formatCurrency(successModal.newBalance)}</span>
                </div>
                {successModal.pointsEarned > 0 && (
                  <div className="success-detail success-points">
                    <span>คะแนนที่ได้รับ</span>
                    <span>+{successModal.pointsEarned} ★</span>
                  </div>
                )}
                <div className="success-detail success-ref">
                  <span>รหัสอ้างอิง</span>
                  <span>{successModal.transactionId?.slice(-8)?.toUpperCase()}</span>
                </div>
              </div>

              <div className="success-actions">
                <Button variant="outline" onClick={handleContinue}>
                  ทำรายการต่อ
                </Button>
                <Button variant="primary" onClick={handleNewTransaction}>
                  ลูกค้าใหม่
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Recent Transactions Modal */}
        <Modal
          isOpen={showTransactionsModal}
          onClose={() => setShowTransactionsModal(false)}
          title="รายการล่าสุด"
          size="lg"
        >
          <div className="transactions-list">
            {recentTransactions.length === 0 ? (
              <p className="no-transactions">ยังไม่มีรายการวันนี้</p>
            ) : (
              recentTransactions.map((tx) => {
                const typeInfo = getTransactionTypeInfo(tx.type);
                return (
                  <div key={tx._id} className="transaction-item">
                    <div className="transaction-info">
                      <span className={`transaction-type type-${typeInfo.color}`}>
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                      <span className="transaction-time">
                        {formatDateTime(tx.createdAt)}
                      </span>
                    </div>
                    <div className="transaction-amount">
                      <span className={tx.type === 'load' ? 'text-success' : ''}>
                        {tx.type === 'load' ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Modal>
      </div>
    </CashierDashboard>
  );
};

export default CashierHome;

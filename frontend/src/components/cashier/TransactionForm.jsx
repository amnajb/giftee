import React, { useState, useCallback } from 'react';
import Button from '../common/Button';
import { QUICK_LOAD_AMOUNTS, VALIDATION, PAYMENT_METHODS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import './TransactionForm.css';

const TransactionForm = ({
  type = 'load', // 'load' or 'charge'
  balance = 0,
  onSubmit,
  onCancel,
  loading = false,
  className = '',
}) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CASH);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  const isLoad = type === 'load';
  const numericAmount = parseFloat(amount) || 0;

  const minAmount = isLoad ? VALIDATION.MIN_LOAD_AMOUNT : VALIDATION.MIN_CHARGE_AMOUNT;
  const maxAmount = isLoad ? VALIDATION.MAX_LOAD_AMOUNT : Math.min(VALIDATION.MAX_CHARGE_AMOUNT, balance);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!amount || numericAmount <= 0) {
      newErrors.amount = 'กรุณาระบุจำนวนเงิน';
    } else if (numericAmount < minAmount) {
      newErrors.amount = `จำนวนเงินขั้นต่ำ ${formatCurrency(minAmount)}`;
    } else if (numericAmount > maxAmount) {
      if (!isLoad && numericAmount > balance) {
        newErrors.amount = 'ยอดเงินไม่เพียงพอ';
      } else {
        newErrors.amount = `จำนวนเงินสูงสุด ${formatCurrency(maxAmount)}`;
      }
    }

    if (!isLoad && !description.trim()) {
      newErrors.description = 'กรุณาระบุรายละเอียด';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [amount, numericAmount, minAmount, maxAmount, isLoad, balance, description]);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    // Allow only one decimal point and max 2 decimal places
    const parts = value.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setAmount(value);
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: null }));
    }
  };

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        amount: numericAmount,
        paymentMethod: isLoad ? paymentMethod : undefined,
        description: !isLoad ? description : undefined,
        notes: notes.trim() || undefined,
      });
    }
  };

  return (
    <form className={`transaction-form ${className}`} onSubmit={handleSubmit}>
      <div className="transaction-form-header">
        <h3 className="transaction-form-title">
          {isLoad ? 'เติมเงิน' : 'ชำระเงิน'}
        </h3>
        {!isLoad && (
          <div className="transaction-form-balance">
            ยอดคงเหลือ: <span>{formatCurrency(balance)}</span>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">จำนวนเงิน (บาท)</label>
        <div className="amount-input-wrapper">
          <span className="amount-prefix">฿</span>
          <input
            type="text"
            inputMode="decimal"
            className={`form-input amount-input ${errors.amount ? 'input-error' : ''}`}
            placeholder="0.00"
            value={amount}
            onChange={handleAmountChange}
            disabled={loading}
            autoFocus
          />
        </div>
        {errors.amount && <span className="form-error">{errors.amount}</span>}

        {isLoad && (
          <div className="quick-amounts">
            {QUICK_LOAD_AMOUNTS.map((value) => (
              <button
                key={value}
                type="button"
                className={`quick-amount-btn ${numericAmount === value ? 'active' : ''}`}
                onClick={() => handleQuickAmount(value)}
                disabled={loading}
              >
                {formatCurrency(value, { decimals: 0 })}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoad && (
        <div className="form-group">
          <label className="form-label">วิธีรับเงิน</label>
          <div className="payment-methods">
            {[
              { value: PAYMENT_METHODS.CASH, label: 'เงินสด', icon: '💵' },
              { value: PAYMENT_METHODS.PROMPTPAY, label: 'พร้อมเพย์', icon: '📱' },
              { value: PAYMENT_METHODS.CREDIT_CARD, label: 'บัตรเครดิต', icon: '💳' },
            ].map((method) => (
              <label
                key={method.value}
                className={`payment-method ${paymentMethod === method.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={loading}
                />
                <span className="payment-method-icon">{method.icon}</span>
                <span className="payment-method-label">{method.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {!isLoad && (
        <div className="form-group">
          <label className="form-label">รายละเอียด</label>
          <input
            type="text"
            className={`form-input ${errors.description ? 'input-error' : ''}`}
            placeholder="เช่น ซื้อกาแฟ, ค่าอาหาร"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: null }));
              }
            }}
            disabled={loading}
          />
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">
          หมายเหตุ <span className="label-optional">(ไม่บังคับ)</span>
        </label>
        <textarea
          className="form-input form-textarea"
          placeholder="บันทึกเพิ่มเติม..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={loading}
          rows={2}
        />
      </div>

      {numericAmount > 0 && (
        <div className="transaction-summary">
          <div className="summary-row">
            <span>จำนวนเงิน</span>
            <span className={`summary-amount ${isLoad ? 'text-success' : 'text-primary'}`}>
              {isLoad ? '+' : '-'}{formatCurrency(numericAmount)}
            </span>
          </div>
          {!isLoad && (
            <div className="summary-row summary-row-after">
              <span>ยอดคงเหลือหลังทำรายการ</span>
              <span>{formatCurrency(balance - numericAmount)}</span>
            </div>
          )}
        </div>
      )}

      <div className="transaction-form-actions">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            ยกเลิก
          </Button>
        )}
        <Button
          type="submit"
          variant={isLoad ? 'success' : 'primary'}
          loading={loading}
          disabled={!amount || numericAmount <= 0}
          fullWidth={!onCancel}
        >
          {isLoad ? 'เติมเงิน' : 'ชำระเงิน'}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;

import React, { useState } from 'react';
import QRScanner from '../common/QRScanner';
import Button from '../common/Button';
import './ScanInterface.css';

const ScanInterface = ({
  onScan,
  onManualEntry,
  loading = false,
  className = '',
}) => {
  const [mode, setMode] = useState('scan'); // 'scan' or 'manual'
  const [cardNumber, setCardNumber] = useState('');
  const [error, setError] = useState('');

  const handleScan = (result) => {
    setError('');
    onScan?.(result);
  };

  const handleScanError = (err) => {
    console.error('Scan error:', err);
    setError('เกิดข้อผิดพลาดในการสแกน');
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(value);
    setError('');
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.length < 8) {
      setError('กรุณากรอกเลขบัตรอย่างน้อย 8 หลัก');
      return;
    }
    onManualEntry?.(cardNumber);
  };

  const formatDisplayNumber = (num) => {
    return num.match(/.{1,4}/g)?.join(' ') || num;
  };

  return (
    <div className={`scan-interface ${className}`}>
      <div className="scan-tabs">
        <button
          className={`scan-tab ${mode === 'scan' ? 'active' : ''}`}
          onClick={() => setMode('scan')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          สแกน QR
        </button>
        <button
          className={`scan-tab ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => setMode('manual')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          กรอกเลขบัตร
        </button>
      </div>

      {mode === 'scan' ? (
        <QRScanner
          onScan={handleScan}
          onError={handleScanError}
          autoStart={true}
          showLINEOption={true}
        />
      ) : (
        <div className="manual-entry">
          <div className="manual-entry-illustration">
            <svg viewBox="0 0 100 70" fill="none">
              <rect x="5" y="5" width="90" height="60" rx="8" fill="var(--color-primary)" />
              <rect x="10" y="40" width="30" height="6" rx="2" fill="var(--color-secondary)" />
              <rect x="10" y="50" width="20" height="4" rx="1" fill="rgba(255,255,255,0.3)" />
              <rect x="60" y="15" width="25" height="20" rx="4" fill="rgba(255,255,255,0.2)" />
              <text x="72.5" y="28" fill="white" fontSize="8" textAnchor="middle">QR</text>
            </svg>
          </div>

          <form onSubmit={handleManualSubmit} className="manual-entry-form">
            <div className="form-group">
              <label className="form-label">เลขบัตร</label>
              <input
                type="text"
                inputMode="numeric"
                className={`form-input card-number-input ${error ? 'input-error' : ''}`}
                placeholder="0000 0000 0000 0000"
                value={formatDisplayNumber(cardNumber)}
                onChange={handleCardNumberChange}
                disabled={loading}
                autoFocus
              />
              <p className="form-hint">กรอกเลขบัตร 16 หลักที่อยู่ด้านหน้าบัตร</p>
              {error && <span className="form-error">{error}</span>}
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={cardNumber.length < 8}
              fullWidth
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              ค้นหาบัตร
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ScanInterface;

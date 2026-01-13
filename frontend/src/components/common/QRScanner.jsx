import React, { useEffect } from 'react';
import useQRScanner from '../../hooks/useQRScanner';
import Button from './Button';
import './QRScanner.css';

const QRScanner = ({
  onScan,
  onError,
  onClose,
  title = 'สแกน QR Code',
  autoStart = true,
  showLINEOption = true,
  className = '',
}) => {
  const {
    isScanning,
    hasPermission,
    availableCameras,
    selectedCamera,
    error,
    canUseLINEScanner,
    videoRef,
    startScanning,
    stopScanning,
    switchCamera,
    scanWithLINE,
    requestPermission,
  } = useQRScanner({
    onScan,
    onError,
  });

  useEffect(() => {
    if (autoStart) {
      startScanning();
    }
    return () => stopScanning();
  }, [autoStart]);

  const handleLINEScan = async () => {
    const result = await scanWithLINE();
    if (result) {
      stopScanning();
    }
  };

  const handleRetry = () => {
    requestPermission().then(() => startScanning());
  };

  return (
    <div className={`qr-scanner ${className}`}>
      <div className="qr-scanner-header">
        <h3 className="qr-scanner-title">{title}</h3>
        {onClose && (
          <button className="qr-scanner-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="qr-scanner-viewport">
        {hasPermission === false ? (
          <div className="qr-scanner-permission">
            <div className="qr-scanner-permission-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <line x1="4" y1="4" x2="20" y2="20" />
              </svg>
            </div>
            <p>กรุณาอนุญาตการเข้าถึงกล้อง</p>
            <Button variant="primary" onClick={handleRetry}>
              อนุญาตการเข้าถึง
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="qr-scanner-video"
              autoPlay
              playsInline
              muted
            />
            <div className="qr-scanner-overlay">
              <div className="qr-scanner-frame">
                <div className="qr-scanner-corner qr-scanner-corner-tl"></div>
                <div className="qr-scanner-corner qr-scanner-corner-tr"></div>
                <div className="qr-scanner-corner qr-scanner-corner-bl"></div>
                <div className="qr-scanner-corner qr-scanner-corner-br"></div>
                {isScanning && <div className="qr-scanner-line"></div>}
              </div>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="qr-scanner-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="qr-scanner-controls">
        {availableCameras.length > 1 && (
          <div className="qr-scanner-cameras">
            <label>กล้อง:</label>
            <select
              value={selectedCamera || ''}
              onChange={(e) => switchCamera(e.target.value)}
            >
              {availableCameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `กล้อง ${camera.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="qr-scanner-actions">
          {!isScanning ? (
            <Button variant="primary" onClick={startScanning} fullWidth>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              เริ่มสแกน
            </Button>
          ) : (
            <Button variant="outline" onClick={stopScanning} fullWidth>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="6" width="12" height="12" />
              </svg>
              หยุดสแกน
            </Button>
          )}
        </div>

        {showLINEOption && canUseLINEScanner && (
          <div className="qr-scanner-line-option">
            <div className="qr-scanner-divider">
              <span>หรือ</span>
            </div>
            <Button
              variant="success"
              onClick={handleLINEScan}
              fullWidth
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 5.81 2 10.5c0 2.49 1.24 4.71 3.18 6.24-.12.43-.74 2.61-.77 2.82-.04.27.1.53.36.61.12.03.24.03.35-.01.15-.05 2.96-1.92 3.72-2.42.7.11 1.42.17 2.16.17 5.52 0 10-3.81 10-8.5S17.52 2 12 2z" />
                </svg>
              }
            >
              สแกนด้วย LINE
            </Button>
          </div>
        )}
      </div>

      <p className="qr-scanner-hint">
        วาง QR Code ของลูกค้าให้อยู่ในกรอบ
      </p>
    </div>
  );
};

export default QRScanner;

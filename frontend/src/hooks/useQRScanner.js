import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import lineService from '../services/line.service';

export const useQRScanner = (options = {}) => {
  const {
    onScan,
    onError,
    preferredCamera = 'environment', // 'environment' for back camera, 'user' for front
    scanInterval = 100,
  } = options;

  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [error, setError] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const streamRef = useRef(null);
  const scanningRef = useRef(false);

  // Check if LINE scanner is available
  const canUseLINEScanner = lineService.canUseLINEScanner();

  // Initialize the scanner
  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();

    return () => {
      stopScanning();
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  // Get available cameras
  const getCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);

      // Select preferred camera
      const preferred = videoDevices.find((device) =>
        device.label.toLowerCase().includes(preferredCamera === 'environment' ? 'back' : 'front')
      );
      setSelectedCamera(preferred?.deviceId || videoDevices[0]?.deviceId);

      return videoDevices;
    } catch (err) {
      console.error('Failed to enumerate cameras:', err);
      setError('ไม่สามารถเข้าถึงกล้องได้');
      onError?.(err);
      return [];
    }
  }, [preferredCamera, onError]);

  // Request camera permission
  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: preferredCamera },
      });
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      await getCameras();
      return true;
    } catch (err) {
      console.error('Camera permission denied:', err);
      setHasPermission(false);
      setError('กรุณาอนุญาตการเข้าถึงกล้อง');
      onError?.(err);
      return false;
    }
  }, [preferredCamera, getCameras, onError]);

  // Start scanning
  const startScanning = useCallback(async () => {
    if (scanningRef.current) return;

    setError(null);

    // Check permission first
    if (hasPermission === null) {
      const granted = await requestPermission();
      if (!granted) return;
    } else if (hasPermission === false) {
      setError('ไม่ได้รับอนุญาตให้เข้าถึงกล้อง');
      return;
    }

    if (!videoRef.current) {
      setError('ไม่พบ video element');
      return;
    }

    try {
      scanningRef.current = true;
      setIsScanning(true);

      const constraints = {
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          facingMode: !selectedCamera ? preferredCamera : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      // Start continuous scanning
      readerRef.current.decodeFromVideoDevice(
        selectedCamera,
        videoRef.current,
        (result, err) => {
          if (result) {
            const text = result.getText();
            if (text !== lastResult) {
              setLastResult(text);
              onScan?.(text);
            }
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error('Scan error:', err);
          }
        }
      );
    } catch (err) {
      console.error('Failed to start scanning:', err);
      setError('ไม่สามารถเริ่มสแกนได้');
      onError?.(err);
      scanningRef.current = false;
      setIsScanning(false);
    }
  }, [hasPermission, selectedCamera, preferredCamera, lastResult, onScan, onError, requestPermission]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    scanningRef.current = false;
    setIsScanning(false);

    if (readerRef.current) {
      readerRef.current.reset();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Toggle scanning
  const toggleScanning = useCallback(() => {
    if (isScanning) {
      stopScanning();
    } else {
      startScanning();
    }
  }, [isScanning, startScanning, stopScanning]);

  // Switch camera
  const switchCamera = useCallback(
    (deviceId) => {
      const wasScanning = isScanning;
      stopScanning();
      setSelectedCamera(deviceId);
      if (wasScanning) {
        setTimeout(startScanning, 100);
      }
    },
    [isScanning, stopScanning, startScanning]
  );

  // Scan using LINE (if available)
  const scanWithLINE = useCallback(async () => {
    if (!canUseLINEScanner) {
      setError('LINE Scanner ไม่พร้อมใช้งาน');
      return null;
    }

    try {
      const result = await lineService.scanQR();
      if (result) {
        setLastResult(result);
        onScan?.(result);
      }
      return result;
    } catch (err) {
      console.error('LINE scan failed:', err);
      setError('การสแกนผ่าน LINE ล้มเหลว');
      onError?.(err);
      return null;
    }
  }, [canUseLINEScanner, onScan, onError]);

  // Reset last result
  const resetResult = useCallback(() => {
    setLastResult(null);
  }, []);

  return {
    // State
    isScanning,
    hasPermission,
    availableCameras,
    selectedCamera,
    error,
    lastResult,
    canUseLINEScanner,
    // Refs
    videoRef,
    // Actions
    requestPermission,
    startScanning,
    stopScanning,
    toggleScanning,
    switchCamera,
    scanWithLINE,
    resetResult,
    getCameras,
  };
};

export default useQRScanner;

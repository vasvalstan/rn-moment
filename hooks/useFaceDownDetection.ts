import { useState, useEffect, useCallback, useRef } from 'react';
import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';
import * as Haptics from 'expo-haptics';

// Thresholds for face-down detection
// z ≈ +1 means phone is face DOWN (screen facing table)
// z ≈ -1 means phone is face UP (screen facing user)
const FACE_DOWN_THRESHOLD = 0.7;   // Phone is considered face-down when z is above this
const FACE_UP_THRESHOLD = 0.3;     // Phone is considered picked up when z drops below this

interface UseFaceDownDetectionOptions {
  onFaceDown?: () => void;
  onPickedUp?: () => void;
  hapticFeedback?: boolean;
  updateInterval?: number; // in milliseconds
}

interface UseFaceDownDetectionReturn {
  isFaceDown: boolean;
  isListening: boolean;
  sensorData: AccelerometerMeasurement | null;
  startListening: () => Promise<boolean>;
  stopListening: () => void;
  isAvailable: boolean | null; // null = still checking
}

export function useFaceDownDetection(
  options: UseFaceDownDetectionOptions = {}
): UseFaceDownDetectionReturn {
  const {
    onFaceDown,
    onPickedUp,
    hapticFeedback = true,
    updateInterval = 100,
  } = options;

  const [isFaceDown, setIsFaceDown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null); // null = checking
  const [sensorData, setSensorData] = useState<AccelerometerMeasurement | null>(null);
  
  const subscriptionRef = useRef<ReturnType<typeof Accelerometer.addListener> | null>(null);
  const wasFaceDownRef = useRef(false);
  const callbacksRef = useRef({ onFaceDown, onPickedUp });

  // Keep callbacks ref updated
  useEffect(() => {
    callbacksRef.current = { onFaceDown, onPickedUp };
  }, [onFaceDown, onPickedUp]);

  const handleAccelerometerData = useCallback(
    (data: AccelerometerMeasurement) => {
      setSensorData(data);
      const { z } = data;

      // Determine if phone is face down
      const currentlyFaceDown = z > FACE_DOWN_THRESHOLD;
      const pickedUp = z < FACE_UP_THRESHOLD;

      // Only trigger state changes when crossing thresholds
      if (currentlyFaceDown && !wasFaceDownRef.current) {
        // Phone just placed face down
        wasFaceDownRef.current = true;
        setIsFaceDown(true);
        
        if (hapticFeedback) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        callbacksRef.current.onFaceDown?.();
      } else if (pickedUp && wasFaceDownRef.current) {
        // Phone was just picked up
        wasFaceDownRef.current = false;
        setIsFaceDown(false);
        
        if (hapticFeedback) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        
        callbacksRef.current.onPickedUp?.();
      }
    },
    [hapticFeedback]
  );

  const startListening = useCallback(async (): Promise<boolean> => {
    // Check availability directly (don't rely on state)
    const available = await Accelerometer.isAvailableAsync();
    setIsAvailable(available);
    
    if (!available) {
      console.warn('Accelerometer is not available on this device');
      return false;
    }

    // Set update interval
    Accelerometer.setUpdateInterval(updateInterval);

    // Start listening
    subscriptionRef.current = Accelerometer.addListener(handleAccelerometerData);
    setIsListening(true);
    return true;
  }, [updateInterval, handleAccelerometerData]);

  const stopListening = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    setIsListening(false);
    setIsFaceDown(false);
    wasFaceDownRef.current = false;
    setSensorData(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  return {
    isFaceDown,
    isListening,
    sensorData,
    startListening,
    stopListening,
    isAvailable,
  };
}

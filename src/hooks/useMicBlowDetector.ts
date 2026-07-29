import { useState, useRef, useCallback, useEffect } from 'react';
import type { MicBlowDetectorOptions, MicBlowDetectorReturn } from '../types';

/**
 * useMicBlowDetector - Custom React hook for microphone blow detection
 * 
 * Uses the Web Audio API to detect sustained blowing sounds by analyzing
 * frequency data from the microphone input. Distinguishes blowing from
 * speech by looking at low-frequency energy patterns and overall volume.
 * 
 * Features:
 * - Real-time blow intensity (0-100)
 * - Adjustable sensitivity threshold
 * - Debounce to prevent false positives
 * - Clean lifecycle management
 * - Graceful fallback on permission denial
 */
export function useMicBlowDetector(options: MicBlowDetectorOptions = {}): MicBlowDetectorReturn {
  const {
    threshold = 35,
    debounceDuration = 200,
    autoStart = false,
    onBlowStart,
    onBlowEnd,
  } = options;

  const [isBlowing, setIsBlowing] = useState(false);
  const [blowIntensity, setBlowIntensity] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isListeningRef = useRef(false);

  // Smoothing buffer for blow detection (moving average over ~150ms)
  const smoothingBufferRef = useRef<number[]>([]);
  const SMOOTHING_WINDOW = 8; // Number of frames to average

  // Track blow state for debounce
  const blowStartRef = useRef<number | null>(null);
  const wasBlowingRef = useRef(false);

  /**
   * Calculate RMS (Root Mean Square) of frequency data
   * focusing on low-frequency bins which are characteristic of blowing
   */
  const calculateBlowEnergy = useCallback((frequencyData: Uint8Array): number => {
    const bufferLength = frequencyData.length;
    // Focus on low-frequency bins (0-2kHz approx) where blowing is strongest
    // Typically bins 0-30 out of 256 for a 44100Hz sample rate
    const lowFreqEnd = Math.min(40, bufferLength);
    let sum = 0;
    for (let i = 0; i < lowFreqEnd; i++) {
      sum += frequencyData[i] * frequencyData[i];
    }
    const rms = Math.sqrt(sum / lowFreqEnd);
    return rms;
  }, []);

  /**
   * Smooth the intensity value using a moving average
   */
  const smoothIntensity = useCallback((rawIntensity: number): number => {
    const buffer = smoothingBufferRef.current;
    buffer.push(rawIntensity);
    if (buffer.length > SMOOTHING_WINDOW) {
      buffer.shift();
    }
    const sum = buffer.reduce((acc, val) => acc + val, 0);
    return sum / buffer.length;
  }, []);

  /**
   * Process audio frame - called on each animation frame
   */
  const processAudioFrame = useCallback(() => {
    if (!isListeningRef.current || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    // Calculate raw blow energy
    const rawEnergy = calculateBlowEnergy(frequencyData);

    // Normalize to 0-100 scale
    const normalizedRaw = Math.min(100, (rawEnergy / 128) * 100);

    // Apply smoothing
    const smoothed = smoothIntensity(normalizedRaw);

    // Update intensity state
    setBlowIntensity(Math.round(smoothed));

    // Determine if blowing with debounce
    const now = Date.now();
    const isCurrentlyBlowing = smoothed > threshold;

    if (isCurrentlyBlowing) {
      if (!blowStartRef.current) {
        blowStartRef.current = now;
      }
      // Only confirm blow after debounce duration
      if (now - blowStartRef.current >= debounceDuration) {
        if (!wasBlowingRef.current) {
          wasBlowingRef.current = true;
          setIsBlowing(true);
          onBlowStart?.();
        }
      }
    } else {
      blowStartRef.current = null;
      if (wasBlowingRef.current) {
        wasBlowingRef.current = false;
        setIsBlowing(false);
        onBlowEnd?.();
      }
    }

    // Continue the loop
    animationFrameRef.current = requestAnimationFrame(processAudioFrame);
  }, [calculateBlowEnergy, smoothIntensity, threshold, debounceDuration, onBlowStart, onBlowEnd]);

  /**
   * Start listening to the microphone
   */
  const startListening = useCallback(async () => {
    // Check browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Microphone access is not supported in this browser. Please use the button below to blow out the candles.');
      setHasPermission(false);
      return;
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      setHasPermission(true);
      setError(null);

      // Create AudioContext
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Resume if suspended (Chrome autoplay policy)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create analyser node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Start processing
      isListeningRef.current = true;
      smoothingBufferRef.current = [];
      blowStartRef.current = null;
      wasBlowingRef.current = false;
      animationFrameRef.current = requestAnimationFrame(processAudioFrame);

    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission was denied. Use the button below to blow out the candles instead!');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Use the button below to blow out the candles instead!');
      } else {
        setError('Could not access microphone. Use the button below to blow out the candles instead!');
      }
      setHasPermission(false);
    }
  }, [processAudioFrame]);

  /**
   * Stop listening and clean up resources
   */
  const stopListening = useCallback(() => {
    isListeningRef.current = false;

    // Cancel animation frame
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Close AudioContext
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    // Stop media stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Reset state
    analyserRef.current = null;
    setIsBlowing(false);
    setBlowIntensity(0);
    smoothingBufferRef.current = [];
    blowStartRef.current = null;
    wasBlowingRef.current = false;
  }, []);

  // Auto-start if configured
  useEffect(() => {
    if (autoStart) {
      startListening();
    }
    return () => {
      stopListening();
    };
  }, [autoStart, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isBlowing,
    blowIntensity,
    hasPermission,
    error,
    startListening,
    stopListening,
  };
}

import { isBrowser } from './env';

/**
 * Options for configuring physical device shake gesture detector.
 */
export interface ShakeDetectorOptions {
  /** Acceleration magnitude threshold in m/s² (default: 12) */
  threshold?: number;
  /** Minimum time between triggered shake events in ms (default: 800) */
  cooldown?: number;
  /** Callback function executed when device shake is detected */
  onShake: () => void;
}

/**
 * Physical device shake gesture detector using low-pass gravity filter sensor fusion.
 */
export class ShakeDetector {
  private threshold: number;
  private cooldown: number;
  private onShake: () => void;
  private lastShakeTime = 0;
  private isListening = false;
  private gestureListenersBound = false;

  // Low-pass filter gravity components
  private gravityX = 0;
  private gravityY = 0;
  private gravityZ = 0;
  private initialized = false;

  private handleMotionBound = this.handleMotion.bind(this);
  private handleGestureBound = this.handleGesturePermission.bind(this);

  constructor(options: ShakeDetectorOptions) {
    this.threshold = options.threshold ?? 12;
    this.cooldown = options.cooldown ?? 800;
    this.onShake = options.onShake;
  }

  /**
   * Starts listening to device motion sensors and handles iOS permission requests.
   */
  public start() {
    if (!isBrowser || this.isListening) return;

    const DeviceMotionEventClass = window.DeviceMotionEvent as any;
    if (typeof DeviceMotionEventClass === 'undefined') return;

    // Immediately bind devicemotion listener so shake works right away on initial page load
    this.bindListener();

    // Check iOS 13+ permission API to ensure explicit permission request on first interaction if needed
    if (typeof DeviceMotionEventClass.requestPermission === 'function') {
      if (!this.gestureListenersBound) {
        window.addEventListener('touchstart', this.handleGestureBound, {
          once: true,
          capture: true,
        });
        window.addEventListener('touchend', this.handleGestureBound, { once: true, capture: true });
        window.addEventListener('click', this.handleGestureBound, { once: true, capture: true });
        window.addEventListener('pointerup', this.handleGestureBound, {
          once: true,
          capture: true,
        });
        this.gestureListenersBound = true;
      }
    }
  }

  private handleGesturePermission() {
    const DeviceMotionEventClass = window.DeviceMotionEvent as any;
    if (
      typeof DeviceMotionEventClass !== 'undefined' &&
      typeof DeviceMotionEventClass.requestPermission === 'function'
    ) {
      // Synchronous call inside user gesture call stack required by iOS Safari
      DeviceMotionEventClass.requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            this.bindListener();
          }
        })
        .catch((err: any) => {
          console.warn('[DevTools] DeviceMotion permission request rejected:', err);
        });
    }
  }

  private bindListener() {
    if (this.isListening) return;
    if (typeof window.DeviceMotionEvent !== 'undefined') {
      window.addEventListener('devicemotion', this.handleMotionBound, false);
      this.isListening = true;
    }
  }

  /**
   * Stops sensor motion listeners and cleans up iOS gesture event listeners.
   */
  public stop() {
    if (!isBrowser) return;

    if (typeof window.DeviceMotionEvent !== 'undefined') {
      window.removeEventListener('devicemotion', this.handleMotionBound, false);
    }
    window.removeEventListener('touchstart', this.handleGestureBound, { capture: true });
    window.removeEventListener('touchend', this.handleGestureBound, { capture: true });
    window.removeEventListener('click', this.handleGestureBound, { capture: true });
    window.removeEventListener('pointerup', this.handleGestureBound, { capture: true });

    this.isListening = false;
    this.gestureListenersBound = false;
    this.initialized = false;
    this.gravityX = 0;
    this.gravityY = 0;
    this.gravityZ = 0;
  }

  /**
   * Handles device motion sensor input events and calculates dynamic user linear acceleration.
   * @param event DeviceMotionEvent instance.
   */
  public handleMotion(event: DeviceMotionEvent) {
    const accel = event.accelerationIncludingGravity || event.acceleration;
    if (!accel) return;

    const { x, y, z } = accel;
    if (x === null || y === null || z === null) return;

    if (!this.initialized) {
      this.gravityX = x;
      this.gravityY = y;
      this.gravityZ = z;
      this.initialized = true;
      return;
    }

    // Low-pass filter (alpha = 0.8) to isolate static gravity vector
    const alpha = 0.8;
    this.gravityX = alpha * this.gravityX + (1 - alpha) * x;
    this.gravityY = alpha * this.gravityY + (1 - alpha) * y;
    this.gravityZ = alpha * this.gravityZ + (1 - alpha) * z;

    // Linear acceleration (dynamic user motion with gravity removed)
    const linearX = x - this.gravityX;
    const linearY = y - this.gravityY;
    const linearZ = z - this.gravityZ;

    const motionMagnitude = Math.sqrt(linearX * linearX + linearY * linearY + linearZ * linearZ);
    const now = Date.now();

    if (motionMagnitude >= this.threshold && now - this.lastShakeTime > this.cooldown) {
      this.lastShakeTime = now;
      this.onShake();
    }
  }
}

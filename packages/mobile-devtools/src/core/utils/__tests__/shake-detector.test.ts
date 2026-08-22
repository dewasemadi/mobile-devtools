import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ShakeDetector } from '../shake-detector';

describe('ShakeDetector', () => {
  let originalDeviceMotionEvent: any;

  beforeEach(() => {
    originalDeviceMotionEvent = window.DeviceMotionEvent;
  });

  afterEach(() => {
    window.DeviceMotionEvent = originalDeviceMotionEvent;
  });

  it('should trigger onShake when linear motion magnitude exceeds threshold', () => {
    const onShake = vi.fn();
    const detector = new ShakeDetector({ threshold: 10, cooldown: 500, onShake });

    // Initial motion event (establishes baseline gravity: 0, 0, 9.8)
    detector.handleMotion({
      accelerationIncludingGravity: { x: 0, y: 0, z: 9.8 },
    } as any);

    expect(onShake).not.toHaveBeenCalled();

    // High dynamic acceleration event (linear motion spike)
    detector.handleMotion({
      accelerationIncludingGravity: { x: 15, y: 15, z: 25 },
    } as any);

    expect(onShake).toHaveBeenCalledTimes(1);
  });

  it('should respect cooldown period between shakes', () => {
    const onShake = vi.fn();
    const detector = new ShakeDetector({ threshold: 5, cooldown: 1000, onShake });

    detector.handleMotion({
      accelerationIncludingGravity: { x: 0, y: 0, z: 0 },
    } as any);

    detector.handleMotion({
      accelerationIncludingGravity: { x: 10, y: 10, z: 10 },
    } as any);

    expect(onShake).toHaveBeenCalledTimes(1);

    // Immediate second shake within cooldown window
    detector.handleMotion({
      accelerationIncludingGravity: { x: 20, y: 20, z: 20 },
    } as any);

    expect(onShake).toHaveBeenCalledTimes(1);
  });

  it('should fallback to event.acceleration when accelerationIncludingGravity is missing', () => {
    const onShake = vi.fn();
    const detector = new ShakeDetector({ threshold: 5, cooldown: 100, onShake });

    detector.handleMotion({
      acceleration: { x: 0, y: 0, z: 0 },
    } as any);

    detector.handleMotion({
      acceleration: { x: 10, y: 10, z: 10 },
    } as any);

    expect(onShake).toHaveBeenCalledTimes(1);
  });

  it('should ignore motion events with null acceleration or coordinates', () => {
    const onShake = vi.fn();
    const detector = new ShakeDetector({ onShake });

    // Null accel
    detector.handleMotion({} as any);
    // Null coordinates
    detector.handleMotion({ accelerationIncludingGravity: { x: null, y: 0, z: 0 } } as any);

    expect(onShake).not.toHaveBeenCalled();
  });

  it('should handle start and stop lifecycle and gesture permission binding', async () => {
    const onShake = vi.fn();
    const requestPermission = vi.fn().mockResolvedValue('granted');
    
    // Mock iOS DeviceMotionEvent
    const MockDeviceMotionEventClass = function () {};
    MockDeviceMotionEventClass.requestPermission = requestPermission;
    window.DeviceMotionEvent = MockDeviceMotionEventClass as any;

    const detector = new ShakeDetector({ onShake });

    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    detector.start();
    // Second call should be no-op
    detector.start();

    expect(addEventListenerSpy).toHaveBeenCalledWith('devicemotion', expect.any(Function), false);
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function), { once: true, capture: true });

    // Trigger gesture event
    const clickEvent = new Event('click');
    window.dispatchEvent(clickEvent);

    await Promise.resolve(); // resolve promise tick for requestPermission

    expect(requestPermission).toHaveBeenCalled();

    detector.stop();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('devicemotion', expect.any(Function), false);

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should handle rejected iOS permission request gracefully', async () => {
    const onShake = vi.fn();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const requestPermission = vi.fn().mockRejectedValue(new Error('Permission denied'));

    const MockDeviceMotionEventClass = function () {};
    MockDeviceMotionEventClass.requestPermission = requestPermission;
    window.DeviceMotionEvent = MockDeviceMotionEventClass as any;

    const detector = new ShakeDetector({ onShake });
    detector.start();

    // Trigger user click interaction to fire permission request
    const clickEvent = new Event('click');
    window.dispatchEvent(clickEvent);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});


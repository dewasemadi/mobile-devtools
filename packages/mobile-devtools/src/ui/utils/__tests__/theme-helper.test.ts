import { describe, expect, it } from 'vitest';
import { THEME_MODES } from '../../../core';
import { applyThemeVariables } from '../theme-helper';

describe('theme-helper', () => {
  it('should clear CSS variables when theme is undefined', () => {
    const el = document.createElement('div');
    el.style.setProperty('--dev-bg', '#000000');
    el.style.setProperty('--dev-accent', '#123456');

    applyThemeVariables(el, undefined);

    expect(el.style.getPropertyValue('--dev-bg')).toBe('');
    expect(el.style.getPropertyValue('--dev-accent')).toBe('');
  });

  it('should apply custom accent and background colors', () => {
    const el = document.createElement('div');
    applyThemeVariables(el, {
      accentColor: '#38bdf8',
      backgroundColor: '#0c0c0e',
    });

    expect(el.style.getPropertyValue('--dev-accent')).toBe('#38bdf8');
    expect(el.style.getPropertyValue('--dev-bg')).toBe('#0c0c0e');
  });

  it('should support 3-digit hex colors and handle invalid hex strings', () => {
    const elLight = document.createElement('div');
    applyThemeVariables(elLight, { backgroundColor: '#fff' });
    expect(elLight.style.getPropertyValue('--dev-text')).toBe('#0f172a');

    const elInvalid = document.createElement('div');
    applyThemeVariables(elInvalid, { backgroundColor: 'invalid' });
    expect(elInvalid.style.getPropertyValue('--dev-text')).toBe('#e2e8f0');
  });

  it('should apply all custom theme color and font overrides', () => {
    const el = document.createElement('div');
    applyThemeVariables(el, {
      cardBackgroundColor: '#1e293b',
      cardBorderColor: '#334155',
      borderColor: '#475569',
      textColor: '#f8fafc',
      textMutedColor: '#94a3b8',
      errorColor: '#ef4444',
      warningColor: '#f59e0b',
      successColor: '#10b981',
      fontFamily: 'monospace',
    });

    expect(el.style.getPropertyValue('--dev-card-bg')).toBe('#1e293b');
    expect(el.style.getPropertyValue('--dev-card-border')).toBe('#334155');
    expect(el.style.getPropertyValue('--dev-border')).toBe('#475569');
    expect(el.style.getPropertyValue('--dev-text')).toBe('#f8fafc');
    expect(el.style.getPropertyValue('--dev-text-muted')).toBe('#94a3b8');
    expect(el.style.getPropertyValue('--dev-error')).toBe('#ef4444');
    expect(el.style.getPropertyValue('--dev-warn')).toBe('#f59e0b');
    expect(el.style.getPropertyValue('--dev-success')).toBe('#10b981');
    expect(el.style.getPropertyValue('--dev-font-sans')).toBe('monospace');
  });

  it('should calculate light background auto contrast for text colors', () => {
    const el = document.createElement('div');
    applyThemeVariables(el, {
      backgroundColor: '#ffffff', // Light background
    });

    expect(el.style.getPropertyValue('--dev-text')).toBe('#0f172a');
    expect(el.style.getPropertyValue('--dev-card-bg')).toBe('#ffffff');
  });

  it('should calculate dark background auto contrast for text colors', () => {
    const el = document.createElement('div');
    applyThemeVariables(el, {
      backgroundColor: '#000000', // Dark background
    });

    expect(el.style.getPropertyValue('--dev-text')).toBe('#e2e8f0');
    expect(el.style.getPropertyValue('--dev-card-bg')).toBe('#141417');
  });

  it('should clear custom theme overrides when mode is toggled', () => {
    const el = document.createElement('div');
    applyThemeVariables(
      el,
      {
        mode: THEME_MODES.DARK,
        backgroundColor: '#000000',
      },
      THEME_MODES.LIGHT
    );

    expect(el.style.getPropertyValue('--dev-bg')).toBe('');
  });
});


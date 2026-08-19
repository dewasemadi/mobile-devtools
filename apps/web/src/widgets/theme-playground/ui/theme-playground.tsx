/* eslint-disable react/prop-types */
'use client';

import React, { useState, useRef } from 'react';
import { Sliders, Copy, Check, Upload, RotateCcw } from 'lucide-react';
import { MobileDevTools } from 'mobile-devtools/react';
import { DevToolsTabId, BadgePositionPreset } from 'mobile-devtools';

export const ThemePlayground: React.FC = () => {
  // Config States (Default values match library defaults)
  const [title, setTitle] = useState('DevTools');
  const [icon, setIcon] = useState('');
  const [position, setPosition] = useState<BadgePositionPreset>('bottom-right');
  const [initialTab, setInitialTab] = useState<DevToolsTabId>('console');
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [accentColor, setAccentColor] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [cardBg, setCardBg] = useState('');
  const [defaultOpenConfig, setDefaultOpenConfig] = useState(false);
  const [autoSnapBadge, setAutoSnapBadge] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [shakeToToggle, setShakeToToggle] = useState(true);
  const [maxLogLimit, setMaxLogLimit] = useState(200);
  const [enabledTabs, setEnabledTabs] = useState<DevToolsTabId[]>([
    'console',
    'elements',
    'network',
    'storage',
    'system',
  ]);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const presetAccents = [
    { name: 'Sky Blue', color: '#0070f3' },
    { name: 'Emerald', color: '#10b981' },
    { name: 'Purple', color: '#8b5cf6' },
    { name: 'Rose', color: '#f43f5e' },
    { name: 'Amber', color: '#f59e0b' },
    { name: 'Cyan', color: '#06b6d4' },
  ];

  const presetBgColors = [
    { name: 'Obsidian', bg: '#0c0c0e', card: '#141417' },
    { name: 'Zinc', bg: '#18181b', card: '#27272a' },
    { name: 'Midnight', bg: '#090d16', card: '#111827' },
    { name: 'Light', bg: '#ffffff', card: '#f8fafc' },
  ];

  const presetIcons = ['⚡', '🚀', '🛠️', '🐛', '📱'];

  const allTabs: { id: DevToolsTabId; label: string }[] = [
    { id: 'console', label: 'Console' },
    { id: 'elements', label: 'Elements' },
    { id: 'network', label: 'Network' },
    { id: 'storage', label: 'Storage' },
    { id: 'system', label: 'System' },
  ];

  const positionPresets: { value: BadgePositionPreset; label: string }[] = [
    { value: 'bottom-right', label: 'bottom-right (default)' },
    { value: 'bottom-left', label: 'bottom-left' },
    { value: 'top-right', label: 'top-right' },
    { value: 'top-left', label: 'top-left' },
    { value: 'bottom', label: 'bottom (center)' },
    { value: 'top', label: 'top (center)' },
    { value: 'left', label: 'left (center)' },
    { value: 'right', label: 'right (center)' },
  ];

  const toggleTab = (tabId: DevToolsTabId) => {
    if (enabledTabs.includes(tabId)) {
      if (enabledTabs.length > 1) {
        setEnabledTabs(enabledTabs.filter((t) => t !== tabId));
      }
    } else {
      setEnabledTabs([...enabledTabs, tabId]);
    }
  };

  const resetToDefaults = () => {
    setTitle('DevTools');
    setIcon('');
    setPosition('bottom-right');
    setInitialTab('console');
    setMode('dark');
    setAccentColor('');
    setBgColor('');
    setCardBg('');
    setDefaultOpenConfig(false);
    setAutoSnapBadge(false);
    setMaxLogLimit(200);
    setEnabledTabs(['console', 'elements', 'network', 'storage', 'system']);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setIcon(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getPlaintextConfig = () => {
    const iconVal = icon ? (icon.startsWith('data:') ? 'data:image/png;base64,...' : icon) : '';

    const props: string[] = [
      `  title="${title || 'DevTools'}"`,
      iconVal ? `  icon="${iconVal}"` : null,
      `  position="${position}"`,
      `  initialTab="${initialTab}"`,
      `  defaultOpen={${defaultOpenConfig}}`,
      `  autoSnapBadge={${autoSnapBadge}}`,
      showBadge === false ? `  showBadge={false}` : null,
      shakeToToggle ? `  shakeToToggle={true}` : null,
      `  enabledTabs={[${enabledTabs.map((t) => `'${t}'`).join(', ')}]}`,
      `  theme={{\n    mode: '${mode}',\n    accentColor: '${accentColor || '#38bdf8'}',\n    backgroundColor: '${bgColor || '#0f172a'}',\n    cardBackgroundColor: '${cardBg || '#1e293b'}'\n  }}`,
      `  interceptors={{\n    maxLogLimit: ${maxLogLimit},\n    maxNetworkLimit: 100,\n    enableConsoleInterceptor: true,\n    enableFetchInterceptor: true,\n    enableXhrInterceptor: true\n  }}`,
      `  privacy={{\n    mask: ['authorization', 'cookie', 'password', 'token', 'secret', 'apikey']\n  }}`,
    ].filter(Boolean) as string[];

    return `<MobileDevTools\n${props.join('\n')}\n/>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPlaintextConfig());
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => {
      setCopied(false);
      copyTimerRef.current = null;
    }, 2000);
  };

  const renderHighlightedConfig = () => {
    const iconVal = icon ? (icon.startsWith('data:') ? 'data:image/png;base64,...' : icon) : '';

    return (
      <code>
        &lt;<span className="text-syntax-function">MobileDevTools</span>
        <div className="pl-4">
          <span className="text-syntax-parameter">title</span>=
          <span className="text-syntax-string">&quot;{title || 'DevTools'}&quot;</span>
        </div>
        {iconVal && (
          <div className="pl-4">
            <span className="text-syntax-parameter">icon</span>=
            <span className="text-syntax-string">&quot;{iconVal}&quot;</span>
          </div>
        )}
        <div className="pl-4">
          <span className="text-syntax-parameter">position</span>=
          <span className="text-syntax-string">&quot;{position}&quot;</span>
        </div>
        <div className="pl-4">
          <span className="text-syntax-parameter">initialTab</span>=
          <span className="text-syntax-string">&quot;{initialTab}&quot;</span>
        </div>
        <div className="pl-4">
          <span className="text-syntax-parameter">defaultOpen</span>={'{'}
          <span className="text-syntax-keyword">{defaultOpenConfig ? 'true' : 'false'}</span>
          {'}'}
        </div>
        <div className="pl-4">
          <span className="text-syntax-parameter">autoSnapBadge</span>={'{'}
          <span className="text-syntax-keyword">{autoSnapBadge ? 'true' : 'false'}</span>
          {'}'}
        </div>
        {showBadge === false && (
          <div className="pl-4">
            <span className="text-syntax-parameter">showBadge</span>={'{'}
            <span className="text-syntax-keyword">false</span>
            {'}'}
          </div>
        )}
        {shakeToToggle && (
          <div className="pl-4">
            <span className="text-syntax-parameter">shakeToToggle</span>={'{'}
            <span className="text-syntax-keyword">true</span>
            {'}'}
          </div>
        )}
        <div className="pl-4">
          <span className="text-syntax-parameter">enabledTabs</span>={'{'}[
          {enabledTabs.map((t, idx) => (
            <React.Fragment key={t}>
              <span className="text-syntax-string">&apos;{t}&apos;</span>
              {idx < enabledTabs.length - 1 ? ', ' : ''}
            </React.Fragment>
          ))}
          ]{'}'}
        </div>
        <div className="pl-4">
          <span className="text-syntax-parameter">theme</span>={'{'}
          {'{'}
          <div className="pl-6">
            <span className="text-syntax-parameter">mode</span>:{' '}
            <span className="text-syntax-string">&apos;{mode}&apos;</span>,
          </div>
          <div className="pl-6">
            <span className="text-syntax-parameter">accentColor</span>:{' '}
            <span className="text-syntax-string">&apos;{accentColor || '#38bdf8'}&apos;</span>,
          </div>
          <div className="pl-6">
            <span className="text-syntax-parameter">backgroundColor</span>:{' '}
            <span className="text-syntax-string">&apos;{bgColor || '#0f172a'}&apos;</span>,
          </div>
          <div className="pl-6">
            <span className="text-syntax-parameter">cardBackgroundColor</span>:{' '}
            <span className="text-syntax-string">&apos;{cardBg || '#1e293b'}&apos;</span>
          </div>
          {'  '}
          {'}'}
          {'}'}
        </div>
        <div className="pl-4">
          <span className="text-syntax-parameter">interceptors</span>={'{'}
          {'{'}
          <div className="pl-6">
            <span className="text-syntax-parameter">maxLogLimit</span>:{' '}
            <span className="font-semibold text-purple-400">{maxLogLimit}</span>,
          </div>
          <div className="pl-6">
            <span className="text-syntax-parameter">maxNetworkLimit</span>:{' '}
            <span className="font-semibold text-purple-400">100</span>,
          </div>
          <div className="pl-6">
            <span className="text-syntax-parameter">enableConsoleInterceptor</span>:{' '}
            <span className="text-syntax-keyword">true</span>,
          </div>
          <div className="pl-6">
            <span className="text-syntax-parameter">enableFetchInterceptor</span>:{' '}
            <span className="text-syntax-keyword">true</span>,
          </div>
          <div className="pl-6">
            <span className="text-syntax-parameter">enableXhrInterceptor</span>:{' '}
            <span className="text-syntax-keyword">true</span>
          </div>
          {'  '}
          {'}'}
          {'}'}
        </div>
        <div className="pl-4">
          <span className="text-syntax-parameter">privacy</span>={'{'}
          {'{'}
          <div className="pl-6">
            <span className="text-syntax-parameter">mask</span>: [
            <span className="text-syntax-string">&apos;authorization&apos;</span>,{' '}
            <span className="text-syntax-string">&apos;cookie&apos;</span>,{' '}
            <span className="text-syntax-string">&apos;password&apos;</span>,{' '}
            <span className="text-syntax-string">&apos;token&apos;</span>,{' '}
            <span className="text-syntax-string">&apos;secret&apos;</span>,{' '}
            <span className="text-syntax-string">&apos;apikey&apos;</span>]
          </div>
          {'  '}
          {'}'}
          {'}'}
        </div>
        /&gt;
      </code>
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Live Single MobileDevTools Component */}
      <MobileDevTools
        forceEnable
        defaultOpen={false}
        title={title || undefined}
        icon={icon || undefined}
        position={position}
        initialTab={initialTab}
        autoSnapBadge={autoSnapBadge}
        showBadge={showBadge}
        shakeToToggle={shakeToToggle}
        enabledTabs={enabledTabs}
        theme={{
          mode,
          accentColor: accentColor || undefined,
          backgroundColor: bgColor || undefined,
          cardBackgroundColor: cardBg || undefined,
        }}
        interceptors={{
          maxLogLimit,
        }}
      />

      {/* Section Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="size-5 text-sky-500 dark:text-sky-400" />
            <h2 className="text-dev-text-bright text-xl font-bold tracking-tight sm:text-2xl">
              Live Props & Theme Customizer
            </h2>
          </div>
          <p className="text-dev-text-muted mt-1 font-sans text-sm">
            Customize DevTools title, custom icon, mode, and position live in real-time.
          </p>
        </div>

        {/* Reset to Defaults Button */}
        <button
          type="button"
          onClick={resetToDefaults}
          className="border-dev-border bg-dev-bg-300 text-dev-text-muted hover:text-dev-text-bright flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 font-sans text-xs font-medium transition-colors"
          title="Reset to Library Default Settings"
        >
          <RotateCcw className="size-3.5" />
          <span className="hidden sm:inline">Reset Defaults</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="border-dev-border bg-dev-bg-100 space-y-6 rounded-lg border p-5 sm:p-6">
        {/* Panel 1: Brand & Theme */}
        <div className="space-y-4">
          <h3 className="border-dev-border text-dev-text-muted border-b pb-2 font-sans text-xs font-semibold">
            Brand & Theme
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-dev-text-bright font-sans text-xs font-semibold">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-dev-border bg-dev-bg-300 text-dev-text-bright w-full rounded-md border px-3.5 py-2 text-xs font-medium focus:border-sky-500 focus:outline-none"
                placeholder="DevTools"
              />
            </div>

            {/* Custom Icon & Image Upload */}
            <div className="space-y-1.5">
              <label className="text-dev-text-bright flex items-center justify-between font-sans text-xs font-semibold">
                <span>Icon (Emoji, Image URL, or Upload)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={icon.startsWith('data:') ? '[Base64 Image Uploaded]' : icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="border-dev-border bg-dev-bg-300 text-dev-text-bright flex-1 rounded-md border px-3.5 py-2 font-mono text-xs focus:border-sky-500 focus:outline-none"
                  placeholder="Default Icon"
                />

                {/* Upload Image Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-dev-border bg-dev-bg-300 text-dev-text-bright flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-3 py-2 font-sans text-xs transition-colors hover:border-sky-500"
                  title="Upload Custom Image Icon"
                >
                  <Upload className="size-3.5 text-sky-400" />
                  <span>Upload</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Quick Icon Presets */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-dev-text-muted mr-1 font-sans text-[11px]">Presets:</span>
                {presetIcons.map((pIcon) => (
                  <button
                    key={pIcon}
                    type="button"
                    onClick={() => setIcon(pIcon)}
                    className={`flex size-6 cursor-pointer items-center justify-center rounded-md border text-xs transition-colors ${
                      icon === pIcon
                        ? 'bg-dev-bg-300 border-sky-500'
                        : 'border-dev-border bg-dev-bg-300/30 hover:border-dev-text-muted'
                    }`}
                  >
                    {pIcon}
                  </button>
                ))}
                {icon && (
                  <button
                    type="button"
                    onClick={() => setIcon('')}
                    className="text-dev-text-muted hover:text-dev-text-bright ml-2 cursor-pointer font-sans text-[11px] underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Theme Mode */}
            <div className="space-y-1.5">
              <label className="text-dev-text-bright font-sans text-xs font-semibold">
                Theme Mode
              </label>
              <div className="border-dev-border bg-dev-bg-300 grid grid-cols-2 gap-2 rounded-md border p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('dark');
                    setBgColor('');
                    setCardBg('');
                  }}
                  className={`cursor-pointer rounded-md px-3 py-1.5 font-sans text-xs font-medium transition-colors ${
                    mode === 'dark'
                      ? 'border-dev-border bg-dev-bg-100 text-dev-text-bright border font-semibold'
                      : 'text-dev-text-muted hover:text-dev-text-bright'
                  }`}
                >
                  Dark Mode
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('light');
                    setBgColor('#ffffff');
                    setCardBg('#f8fafc');
                  }}
                  className={`cursor-pointer rounded-md px-3 py-1.5 font-sans text-xs font-medium transition-colors ${
                    mode === 'light'
                      ? 'border-dev-border bg-dev-bg-100 text-dev-text-bright border font-semibold'
                      : 'text-dev-text-muted hover:text-dev-text-bright'
                  }`}
                >
                  Light Mode
                </button>
              </div>
            </div>

            {/* Background Presets */}
            <div className="space-y-1.5">
              <label className="text-dev-text-bright font-sans text-xs font-semibold">
                Background Palette
              </label>
              <div className="grid grid-cols-2 gap-2">
                {presetBgColors.map((preset) => {
                  const isSelected = bgColor === preset.bg;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setBgColor(preset.bg);
                        setCardBg(preset.card);
                        if (preset.name === 'Light') setMode('light');
                        else if (mode === 'light') setMode('dark');
                      }}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-left font-sans text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-dev-bg-300 text-dev-text-bright border-sky-500 font-semibold'
                          : 'border-dev-border bg-dev-bg-300/40 text-dev-text-muted hover:text-dev-text-bright'
                      }`}
                    >
                      <span
                        className="border-dev-border size-3 shrink-0 rounded-full border"
                        style={{ backgroundColor: preset.bg }}
                      />
                      <span>{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Accent Color Swatches */}
          <div className="border-dev-border space-y-1.5 border-t pt-1">
            <label className="text-dev-text-bright flex items-center justify-between font-sans text-xs font-semibold">
              <span>Accent Color</span>
              <span className="text-dev-text-muted font-mono text-[11px]">
                {accentColor || 'default'}
              </span>
            </label>
            <div className="flex items-center gap-2">
              {presetAccents.map((item) => (
                <button
                  key={item.color}
                  type="button"
                  onClick={() => setAccentColor(item.color)}
                  className={`size-6 cursor-pointer rounded-full border transition-transform ${
                    accentColor === item.color
                      ? 'scale-110 border-white ring-2 ring-sky-500/40'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: item.color }}
                  title={item.name}
                />
              ))}
              <div className="border-dev-border ml-1 size-6 shrink-0 cursor-pointer overflow-hidden rounded-full border">
                <input
                  type="color"
                  value={accentColor || '#0070f3'}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="-m-2 size-10 cursor-pointer border-0 bg-transparent p-0"
                />
              </div>
              {accentColor && (
                <button
                  type="button"
                  onClick={() => setAccentColor('')}
                  className="text-dev-text-muted hover:text-dev-text-bright ml-2 cursor-pointer font-sans text-[11px] underline"
                >
                  Clear Accent
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Panel 2: Screen & Behavior Props */}
        <div className="border-dev-border space-y-4 border-t pt-2">
          <h3 className="border-dev-border text-dev-text-muted border-b pb-2 font-sans text-xs font-semibold">
            Screen & Behavior
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Position Select */}
            <div className="space-y-1.5">
              <label className="text-dev-text-bright font-sans text-xs font-semibold">
                Position
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as BadgePositionPreset)}
                className="border-dev-border bg-dev-bg-300 text-dev-text-bright w-full cursor-pointer appearance-none rounded-md border bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%2394a3b8%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%276%209%2012%2015%2018%209%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat px-3.5 py-2 pr-10 font-mono text-xs focus:border-sky-500 focus:outline-none"
              >
                {positionPresets.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Initial Tab Select */}
            <div className="space-y-1.5">
              <label className="text-dev-text-bright font-sans text-xs font-semibold">
                Initial Tab
              </label>
              <select
                value={initialTab}
                onChange={(e) => setInitialTab(e.target.value as DevToolsTabId)}
                className="border-dev-border bg-dev-bg-300 text-dev-text-bright w-full cursor-pointer appearance-none rounded-md border bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%2394a3b8%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%276%209%2012%2015%2018%209%27%3e%3c/polyline%3e%3c/svg%3e')] bg-size-[16px_16px] bg-position-[right_12px_center] bg-no-repeat px-3.5 py-2 pr-10 font-mono text-xs focus:border-sky-500 focus:outline-none"
              >
                <option value="console">console</option>
                <option value="elements">elements</option>
                <option value="network">network</option>
                <option value="storage">storage</option>
                <option value="system">system</option>
              </select>
            </div>
          </div>

          {/* Enabled Tabs Filter */}
          <div className="space-y-1.5">
            <label className="text-dev-text-bright font-sans text-xs font-semibold">
              Enabled Tabs
            </label>
            <div className="flex flex-wrap gap-2">
              {allTabs.map((t) => {
                const isChecked = enabledTabs.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTab(t.id)}
                    className={`cursor-pointer rounded-md border px-3 py-1.5 font-sans text-xs font-medium transition-colors ${
                      isChecked
                        ? 'bg-dev-bg-300 text-dev-text-bright border-sky-500 font-semibold'
                        : 'border-dev-border bg-dev-bg-300/40 text-dev-text-muted opacity-60'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Styled Checkboxes */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
            <button
              type="button"
              onClick={() => setDefaultOpenConfig(!defaultOpenConfig)}
              className="text-dev-text-bright flex cursor-pointer items-center gap-2 font-sans text-xs font-medium select-none"
            >
              <span
                className={`flex size-4 items-center justify-center rounded border transition-colors ${
                  defaultOpenConfig
                    ? 'border-sky-500 bg-sky-500 text-white'
                    : 'border-dev-border bg-dev-bg-300 text-transparent hover:border-sky-500'
                }`}
              >
                <Check className="size-3 stroke-3" />
              </span>
              <span>defaultOpen</span>
            </button>

            <button
              type="button"
              onClick={() => setAutoSnapBadge(!autoSnapBadge)}
              className="text-dev-text-bright flex cursor-pointer items-center gap-2 font-sans text-xs font-medium select-none"
            >
              <span
                className={`flex size-4 items-center justify-center rounded border transition-colors ${
                  autoSnapBadge
                    ? 'border-sky-500 bg-sky-500 text-white'
                    : 'border-dev-border bg-dev-bg-300 text-transparent hover:border-sky-500'
                }`}
              >
                <Check className="size-3 stroke-3" />
              </span>
              <span>autoSnapBadge</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBadge(!showBadge)}
              className="text-dev-text-bright flex cursor-pointer items-center gap-2 font-sans text-xs font-medium select-none"
            >
              <span
                className={`flex size-4 items-center justify-center rounded border transition-colors ${
                  showBadge
                    ? 'border-sky-500 bg-sky-500 text-white'
                    : 'border-dev-border bg-dev-bg-300 text-transparent hover:border-sky-500'
                }`}
              >
                <Check className="size-3 stroke-3" />
              </span>
              <span>showBadge</span>
            </button>

            <button
              type="button"
              onClick={() => setShakeToToggle(!shakeToToggle)}
              className="text-dev-text-bright flex cursor-pointer items-center gap-2 font-sans text-xs font-medium select-none"
            >
              <span
                className={`flex size-4 items-center justify-center rounded border transition-colors ${
                  shakeToToggle
                    ? 'border-sky-500 bg-sky-500 text-white'
                    : 'border-dev-border bg-dev-bg-300 text-transparent hover:border-sky-500'
                }`}
              >
                <Check className="size-3 stroke-3" />
              </span>
              <span>shakeToToggle</span>
            </button>
          </div>
        </div>

        {/* Panel 3: Vibrant Syntax-Highlighted Code Output Card */}
        <div className="border-dev-border mt-6 overflow-hidden rounded-lg border">
          <div className="border-dev-border bg-dev-bg-300 flex items-center justify-between border-b px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Sliders className="size-4 text-purple-400" />
              <span className="text-dev-text-muted font-mono text-xs">Generated Configuration</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="border-dev-border bg-dev-bg-200 text-dev-text-muted hover:text-dev-text-bright inline-flex cursor-pointer items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span className="font-bold text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="text-dev-text-muted size-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="bg-dev-bg-100 text-dev-text-main overflow-x-auto p-4 font-mono text-xs leading-relaxed sm:p-5">
            {renderHighlightedConfig()}
          </pre>
        </div>
      </div>
    </div>
  );
};

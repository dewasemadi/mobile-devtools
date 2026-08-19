# 02. Getting Started & Framework Integrations

`mobile-devtools` provides first-class framework adapters for **React 18/19**, **Vue 3**, **Svelte 4/5**, and **Vanilla JavaScript**.

---

## 📦 Installation

Install `mobile-devtools` via your preferred package manager:

```bash
# npm
npm install mobile-devtools

# pnpm
pnpm add mobile-devtools

# yarn
yarn add mobile-devtools
```

---

## ⚛️ React 18 / 19 Integration

Import from `mobile-devtools/react`. The component automatically mounts into Shadow DOM and cleans up on unmount.

```tsx
import React from 'react';
import { MobileDevTools } from 'mobile-devtools/react';

export default function App() {
  return (
    <>
      <YourMainAppComponents />

      {/* Mobile DevTools Overlay */}
      <MobileDevTools
        title="App Debugger"
        position="bottom-right"
        enabledTabs={['console', 'elements', 'network', 'storage', 'system']}
        theme={{
          mode: 'dark',
          accentColor: '#0070f3',
        }}
        autoSnapBadge
      />
    </>
  );
}
```

### Next.js App Router (`app/layout.tsx`)

In Next.js App Router, render `<MobileDevTools />` inside a Client Component or mark the component with `'use client'`:

```tsx
'use client';

import { MobileDevTools } from 'mobile-devtools/react';

export function DevToolsProvider() {
  // Automatically disabled in production builds unless forceEnable is set
  return (
    <MobileDevTools title="Next.js Debugger" position="bottom-right" theme={{ mode: 'dark' }} />
  );
}
```

---

## 💚 Vue 3 Integration

Import from `mobile-devtools/vue`. Supports Composition API and Options API.

```html
<script setup>
  import { MobileDevTools } from 'mobile-devtools/vue';
</script>

<template>
  <router-view />

  <!-- Mobile DevTools Overlay -->
  <MobileDevTools
    title="Vue Debugger"
    position="bottom-right"
    :enabled-tabs="['console', 'elements', 'network', 'storage', 'system']"
    :theme="{ mode: 'dark', accentColor: '#42b883' }"
    auto-snap-badge
  />
</template>
```

### Vue 3 Composition Hook (`useMobileDevTools`)

For programmatic control over DevTools in Vue:

```html
<script setup>
  import { useMobileDevTools } from 'mobile-devtools/vue';

  const { getEngine, getStore } = useMobileDevTools({
    title: 'Vue Hook Debugger',
    position: 'bottom-right',
  });
</script>
```

---

## 🧡 Svelte 4 / 5 Integration

Import from `mobile-devtools/svelte`. Supports both the Svelte Action directive and the programmatic lifecycle hook.

### Svelte Action Directive (`use:mobileDevTools`)

The most common way to initialize DevTools in Svelte is by using the Action directive on a container element:

```html
<script lang="ts">
  import { mobileDevTools } from 'mobile-devtools/svelte';
</script>

<!-- The action directive automatically manages the mount and cleanup lifecycle -->
<div use:mobileDevTools={{ theme: { mode: 'dark' }, shakeToToggle: true }}>
  <!-- Your main application goes here -->
</div>
```

### Svelte Programmatic Hook (`useMobileDevTools`)

For programmatic control over mounting and configuration:

```html
<script lang="ts">
  import { useMobileDevTools } from 'mobile-devtools/svelte';

  const { store, destroy } = useMobileDevTools({
    title: 'Svelte Hook Debugger',
    position: 'bottom-right',
  });
</script>
```

---

## 🍦 Vanilla JS / Legacy Applications

Import `createMobileDevTools` directly from `mobile-devtools`:

```typescript
import { createMobileDevTools } from 'mobile-devtools';

// Initialize DevTools on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const devtools = createMobileDevTools({
    title: 'Vanilla JS App',
    position: 'bottom-right',
    enabledTabs: ['console', 'elements', 'network', 'storage', 'system'],
    theme: {
      mode: 'dark',
      accentColor: '#f7df1e',
    },
  });

  // Programmatic control API
  // devtools.updateConfig({ position: 'top-left' });
  // devtools.destroy();
});
```

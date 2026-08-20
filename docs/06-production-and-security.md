# 06. Production Safety & Security Best Practices

`mobile-devtools` is built with enterprise security and production safety as primary requirements.

---

## 🛡️ 1. Production Bundle Tree-Shaking (Zero-Leak Pattern)

While `mobile-devtools` has an extremely small footprint (~32.2 kB gzipped / ~135.9 kB minified), best practices dictate that debugging tools should never be included in production client bundles unless specifically required for QA/Staging environments.

### A. Dynamic Import Pattern (React / Next.js / Vite)

```tsx
import React, { useEffect, useState } from 'react';

export function DevToolsLoader() {
  const [DevToolsComponent, setDevToolsComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Only import and mount in non-production environments
    if (process.env.NODE_ENV === 'development') {
      import('mobile-devtools/react').then((mod) => {
        setDevToolsComponent(() => mod.MobileDevTools);
      });
    }
  }, []);

  if (!DevToolsComponent) return null;

  return <DevToolsComponent title="Dev Overlay" position="bottom-right" />;
}
```

### B. Environment Control (`enabled` & `forceEnable`)

If DevTools is included in your main application component, the core engine automatically checks environment variables:

```ts
// Engine initialization logic
const isEnvDev = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
const shouldRender = config.forceEnable ?? config.enabled ?? isEnvDev ?? true;
```

- In **Development** (`NODE_ENV === 'development'`): Renders automatically (`enabled: true`).
- In **Production** (`NODE_ENV === 'production'`): Skips mounting (`enabled: false`).
- In **Staging / QA Build**: Pass `forceEnable: true` to force DevTools to render on QA staging domains even in production builds.

---

## 🔒 2. Data Privacy & Header Masking (`privacy.mask`)

To prevent accidental leaks of sensitive tokens, user credentials, or authorization cookies during live mobile screen shares, recording sessions, or bug exports, `mobile-devtools` automatically scrubs sensitive keys.

### Default Masked Key Keywords:

- `authorization`
- `cookie`
- `token`
- `password`
- `secret`
- `apikey`
- `access_token`

### Custom Privacy Configuration:

```tsx
<MobileDevTools
  privacy={{
    mask: ['authorization', 'cookie', 'x-api-key', 'session_id', 'ssn'],
  }}
/>
```

Masked values are replaced in the UI with `"[MASKED]"` before rendering in Network headers, query params, or body payloads.

---

## 🌐 3. Non-Secure HTTP Context Fallback

When debugging mobile devices connected via local Wi-Fi IP addresses (e.g. `http://192.168.1.50:3000`), modern browsers disable `navigator.clipboard.writeText` because the connection is non-secure HTTP (not HTTPS/localhost).

`mobile-devtools` includes automatic fallback handlers:

- **Clipboard Fallback**: Uses legacy `document.execCommand('copy')` with hidden textarea when `navigator.clipboard` is undefined.
- **Web Share Fallback**: Automatically falls back to generating a downloadable `.txt` bug report when `navigator.share` is unavailable.

# 05. Custom Tabs & Fine-Grained UI Styling

`mobile-devtools` provides powerful extension points through **Pluggable Custom Tabs** and **Granular UI Style Overrides**.

---

## 🔌 1. Pluggable Custom Tabs (`customTabs`)

Consumer applications can add custom tabs to the DevTools drawer (e.g. Analytics dashboard, Feature Flag toggle, Auth Token inspector, or Performance monitor).

### API Signature:

```ts
export interface CustomTabDefinition {
  id: string;
  title: string;
  icon?: string;
  render?: (container: HTMLElement) => void;
}
```

### Example: Adding a Custom Analytics Tab (React)

```tsx
import { MobileDevTools } from 'mobile-devtools/react';

export default function App() {
  return (
    <MobileDevTools
      title="My App Debugger"
      customTabs={[
        {
          id: 'analytics',
          title: 'Analytics',
          render: (container) => {
            // Render custom HTML/DOM inside container
            container.innerHTML = `
              <div style="padding: 16px; color: #f8fafc;">
                <h3 style="margin-bottom: 8px;">📊 Real-time Analytics</h3>
                <p style="font-size: 13px; color: #94a3b8;">
                  Tracking user interaction events live.
                </p>
                <button id="btn-trigger" style="margin-top: 12px; padding: 6px 12px; background: #0070f3; color: white; border: none; border-radius: 6px;">
                  Trigger Track Event
                </button>
              </div>
            `;

            const btn = container.querySelector('#btn-trigger');
            btn?.addEventListener('click', () => {
              console.log('[Analytics Event] Button Clicked!');
            });
          },
        },
      ]}
    />
  );
}
```

---

## 🎨 2. Fine-Grained UI Styling (`styles`)

Customize individual DevTools UI components without breaking the Shadow DOM isolation.

### `styles` Object Structure:

```ts
export interface DevToolsStyles {
  badge?: Record<string, string>;
  drawer?: Record<string, string>;
  overlay?: Record<string, string>;
  handle?: Record<string, string>;
}
```

### Example Usage:

```tsx
<MobileDevTools
  title="Custom App Debugger"
  styles={{
    badge: {
      opacity: '0.9',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
    drawer: {
      maxHeight: '85vh',
      backgroundColor: '#090d16',
      borderTopLeftRadius: '20px',
      borderTopRightRadius: '20px',
    },
    overlay: {
      backdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
  }}
/>
```

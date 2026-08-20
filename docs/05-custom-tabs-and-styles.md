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

## 🎨 2. Custom CSS Style Injection (`styles`)

Inject raw CSS strings directly into the DevTools Shadow DOM container to style any internal element, state, or animation.

### Example Usage:

```tsx
<MobileDevTools
  title="Custom App Debugger"
  styles={`
    .devtools-badge {
      border-radius: 4px;
      opacity: 0.9;
    }
    .devtools-badge:hover {
      transform: scale(1.08);
    }
    .devtools-tab-btn.active {
      background: #6366f1;
    }
    .devtools-drawer {
      max-height: 85vh;
    }
  `}
/>
```

---

## 🏷️ 3. Custom Badge Crafting with Drag & Drop (`renderBadge`)

Replace the inner HTML/DOM structure of the floating badge while **retaining 100% of the drag-and-drop gesture handling, viewport clamping, and edge snapping functionality**.

### Example Usage:

```tsx
<MobileDevTools
  title="My App"
  autoSnapBadge={true}
  renderBadge={(container, { unreadErrors, isOpen }) => {
    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px; padding: 2px 4px;">
        <span style="font-size: 14px;">🚀</span>
        <span style="font-weight: 700; color: #f8fafc; font-size: 11px;">MY DEBUGGER</span>
        ${
          unreadErrors > 0
            ? `<span style="background: #ef4444; color: #ffffff; padding: 1px 6px; border-radius: 99px; font-size: 10px; font-weight: 800;">${unreadErrors}</span>`
            : ''
        }
      </div>
    `;
  }}
/>
```

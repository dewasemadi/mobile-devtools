'use client';

import React from 'react';
import { Terminal, Globe, Database, Play, AlertTriangle, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export const TestHarness: React.FC = () => {
  const sseRef = React.useRef<EventSource | null>(null);
  const [isSSESubscribed, setIsSSESubscribed] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
    };
  }, []);

  const triggerConsoleLog = () => {
    console.log('🚀 User triggered console log', {
      timestamp: new Date().toISOString(),
      user: { id: 'usr_888', role: 'admin' },
    });
  };

  const triggerConsoleWarn = () => {
    console.warn('⚠️ Performance Warning: Image resource load exceeded threshold', {
      resource: '/hero-banner.png',
      duration: '480ms',
    });
  };

  const triggerConsoleError = () => {
    try {
      throw new Error('TypeError: Cannot read properties of undefined (reading "map")');
    } catch (e) {
      console.error('🔥 Runtime Exception Captured:', e);
    }
  };

  const triggerFetchSuccess = async () => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
      const data = await res.json();
      console.log('Fetched JSONPlaceholder user:', data);
    } catch (e) {
      console.error('Fetch error:', e);
    }
  };

  const triggerFetchError = async () => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts/error-500', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Simulated Danger Error',
          body: 'Testing 500 Internal Server Error',
          userId: 99,
        }),
      });
      if (!res.ok) {
        console.error('🔥 POST /posts (500) Simulated Danger Error:', {
          status: 500,
          statusText: 'Internal Server Error',
          endpoint: '/api/posts/checkout',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error('🔥 POST /posts Error captured:', e);
    }
  };

  const triggerFetch404 = async () => {
    try {
      await fetch('https://jsonplaceholder.typicode.com/posts/999999', { method: 'PUT' });
    } catch (e) {
      console.error('404 error:', e);
    }
  };

  const setLocalStorageDemo = () => {
    localStorage.setItem('auth_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_token_99');
    localStorage.setItem('theme_preference', 'dark');
    console.log('Updated localStorage entries');
  };

  const setSessionStorageDemo = () => {
    sessionStorage.setItem('active_session_id', 'sess_active_777');
    sessionStorage.setItem('temporary_step', 'checkout_review');
    console.log('Updated sessionStorage entries');
  };

  const setCookieDemo = () => {
    document.cookie = 'session_id=sess_mobile_devtools_999; path=/';
    console.log('Set demo cookie entry');
  };

  const triggerWebSocketDemo = () => {
    try {
      const ws = new WebSocket('wss://echo.websocket.org');
      ws.onopen = () => {
        console.log('⚡ WebSocket Connected to wss://echo.websocket.org');
        ws.send(
          JSON.stringify({
            event: 'ping',
            payload: { client: 'mobile-devtools-demo', timestamp: Date.now() },
          })
        );
      };
      ws.onmessage = (evt) => {
        console.log('⚡ WebSocket Message Received:', evt.data);
      };
      ws.onerror = (err) => {
        console.error('⚡ WebSocket Error:', err);
      };
    } catch (e) {
      console.error('WebSocket simulation error:', e);
    }
  };

  const toggleSSEDemo = () => {
    if (isSSESubscribed && sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
      setIsSSESubscribed(false);
      console.log('📡 SSE Connection Closed by User');
      return;
    }

    try {
      const sseUrl = '/api/sse';
      const es = new EventSource(sseUrl);
      sseRef.current = es;
      setIsSSESubscribed(true);

      es.onopen = () => {
        console.log(`📡 SSE Connection Established to ${sseUrl}`);
      };
      es.onmessage = (evt) => {
        console.log('📡 SSE Stream Event Received:', evt.data);
      };
      es.onerror = (err) => {
        console.warn('📡 SSE Connection Error / Closed:', err);
      };
    } catch (e) {
      console.error('SSE simulation error:', e);
    }
  };

  const triggerShakeDemo = () => {
    // 1. Establish baseline rest acceleration
    const baseEvt = Object.assign(new Event('devicemotion'), {
      accelerationIncludingGravity: { x: 0, y: 0, z: 9.8 },
    });
    window.dispatchEvent(baseEvt);

    // 2. Dispatch high acceleration motion burst
    const shakeEvt = Object.assign(new Event('devicemotion'), {
      accelerationIncludingGravity: { x: 25, y: 25, z: 25 },
    });
    window.dispatchEvent(shakeEvt);

    console.log('📱 Simulated Device Shake Event Dispatched!');
  };

  const seedIndexedDBDemo = () => {
    if (typeof window === 'undefined' || !window.indexedDB) return;
    const req = indexedDB.open('AppCacheDB', 1);
    req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
    req.onsuccess = (e: Event) => {
      const db = (e.target as IDBOpenDBRequest).result;
      const tx = db.transaction(['users', 'settings'], 'readwrite');
      const userStore = tx.objectStore('users');
      userStore.put({ id: 'usr_101', name: 'John Doe', role: 'Developer', active: true });
      userStore.put({ id: 'usr_102', name: 'Jane Smith', role: 'Designer', active: false });

      const settingStore = tx.objectStore('settings');
      settingStore.put({ key: 'theme', value: 'dark', updated: new Date().toISOString() });
      settingStore.put({
        key: 'notifications',
        value: 'enabled',
        updated: new Date().toISOString(),
      });

      tx.oncomplete = () => {
        db.close();
        console.log('🗄️ IndexedDB "AppCacheDB" seeded with sample stores & records!');
      };
    };
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h2 className="text-dev-text-bright text-xl font-bold tracking-tight sm:text-2xl">
          Interactive Test Controls
        </h2>
        <p className="text-dev-text-muted text-sm">
          Click any action button below and tap the floating{' '}
          <strong className="text-dev-text-bright">DevTools</strong> badge in the corner to inspect
          captured data!
        </p>
      </div>

      <div className="border-dev-border bg-dev-bg-100 space-y-4 rounded-2xl border p-5">
        {/* Console Interceptor Card */}
        <div className="border-dev-border bg-dev-bg-300/80 space-y-3 rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-emerald-500 dark:text-emerald-400" />
            <h3 className="text-dev-text-bright text-sm font-bold">1. Console Interceptor Test</h3>
          </div>
          <p className="text-dev-text-muted text-xs">
            Trigger console entries to test badge counter & stack trace formatting.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={triggerConsoleLog}>
              <Play className="text-dev-text-muted size-3.5" />
              <span>console.log()</span>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="text-amber-600 dark:text-amber-400"
              onClick={triggerConsoleWarn}
            >
              <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span>console.warn()</span>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="text-rose-600 dark:text-rose-400"
              onClick={triggerConsoleError}
            >
              <AlertCircle className="size-3.5 text-rose-600 dark:text-rose-400" />
              <span>console.error()</span>
            </Button>
          </div>
        </div>

        {/* Network Test Card */}
        <div className="border-dev-border bg-dev-bg-300/80 space-y-3 rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-sky-500 dark:text-sky-400" />
            <h3 className="text-dev-text-bright text-sm font-bold">
              2. Network (Fetch & XHR) Test
            </h3>
          </div>
          <p className="text-dev-text-muted text-xs">
            Trigger real HTTP requests to test timing, JSON body, & Copy cURL.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={triggerFetchSuccess}>
              <Play className="text-dev-text-muted size-3.5" />
              <span>GET /users/1 (200)</span>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="text-amber-600 dark:text-amber-400"
              onClick={triggerFetch404}
            >
              <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span>PUT /posts/999999 (404)</span>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="text-rose-600 dark:text-rose-400"
              onClick={triggerFetchError}
            >
              <AlertCircle className="size-3.5 text-rose-600 dark:text-rose-400" />
              <span>POST /posts (500 Danger)</span>
            </Button>
          </div>
        </div>

        {/* Storage Inspector Card */}
        <div className="border-dev-border bg-dev-bg-300/80 space-y-3 rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-purple-500 dark:text-purple-400" />
            <h3 className="text-dev-text-bright text-sm font-bold">3. Storage Inspector Test</h3>
          </div>
          <p className="text-dev-text-muted text-xs">
            Mutate localStorage, sessionStorage, and document.cookie to test the Storage Inspector
            tab.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={setLocalStorageDemo}>
              <span>Set localStorage</span>
            </Button>
            <Button size="sm" variant="secondary" onClick={setSessionStorageDemo}>
              <span>Set sessionStorage</span>
            </Button>
            <Button size="sm" variant="secondary" onClick={setCookieDemo}>
              <span>Set Cookie</span>
            </Button>
            <Button size="sm" variant="secondary" onClick={seedIndexedDBDemo}>
              <span>Seed IndexedDB</span>
            </Button>
          </div>
        </div>

        {/* WebSocket, SSE & Motion Test Card */}
        <div className="border-dev-border bg-dev-bg-300/80 space-y-3 rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-amber-500 dark:text-amber-400" />
            <h3 className="text-dev-text-bright text-sm font-bold">
              4. WebSocket, SSE & Shake Motion Test
            </h3>
          </div>
          <p className="text-dev-text-muted text-xs">
            Simulate real-time WebSocket frames, EventSource streams, and device shake gesture.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={triggerWebSocketDemo}>
              <span>Connect WebSocket</span>
            </Button>
            <Button
              size="sm"
              variant={isSSESubscribed ? 'danger' : 'secondary'}
              onClick={toggleSSEDemo}
            >
              <span>{isSSESubscribed ? 'Unsubscribe EventSource' : 'Subscribe EventSource'}</span>
            </Button>
            <Button size="sm" variant="secondary" onClick={triggerShakeDemo}>
              <span>Simulate Device Shake</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

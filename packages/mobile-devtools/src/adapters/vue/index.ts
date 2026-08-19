import { defineComponent, onMounted, onUnmounted, PropType, watch } from 'vue';
import { DevToolsConfig, DevToolsStore } from '../../core';
import { MobileDevToolsEngine } from '../../ui';

export function useMobileDevTools(config?: DevToolsConfig): {
  getEngine: () => MobileDevToolsEngine | null;
  getStore: () => DevToolsStore | undefined;
} {
  let engine: MobileDevToolsEngine | null = null;

  onMounted(() => {
    engine = new MobileDevToolsEngine(config);
    engine.mount();
  });

  onUnmounted(() => {
    if (engine) {
      engine.destroy();
      engine = null;
    }
  });

  return {
    getEngine: () => engine,
    getStore: () => engine?.getStore(),
  };
}

export const MobileDevTools = defineComponent({
  name: 'MobileDevTools',
  props: {
    config: { type: Object as PropType<DevToolsConfig>, default: undefined },
    enabled: { type: Boolean as PropType<boolean>, default: undefined },
    forceEnable: { type: Boolean as PropType<boolean>, default: undefined },
    title: { type: String as PropType<string>, default: undefined },
    position: {
      type: [String, Object] as PropType<DevToolsConfig['position']>,
      default: undefined,
    },
    theme: { type: Object as PropType<DevToolsConfig['theme']>, default: undefined },
    initialTab: { type: String as PropType<DevToolsConfig['initialTab']>, default: undefined },
    enabledTabs: { type: Array as PropType<DevToolsConfig['enabledTabs']>, default: undefined },
    autoSnapBadge: { type: Boolean as PropType<boolean>, default: undefined },
    styles: { type: Object as PropType<DevToolsConfig['styles']>, default: undefined },
    interceptors: { type: Object as PropType<DevToolsConfig['interceptors']>, default: undefined },
  },
  setup(props) {
    let engine: MobileDevToolsEngine | null = null;

    const getConfig = (): DevToolsConfig => {
      const cleaned: Record<string, any> = {};
      for (const key in props) {
        const val = (props as any)[key];
        if (val !== undefined && key !== 'config') {
          cleaned[key] = val;
        }
      }
      return props.config ? { ...props.config, ...cleaned } : (cleaned as DevToolsConfig);
    };

    onMounted(() => {
      engine = new MobileDevToolsEngine(getConfig());
      engine.mount();
    });

    watch(
      () => props,
      () => {
        if (engine) {
          engine.updateConfig(getConfig());
        }
      },
      { deep: true }
    );

    onUnmounted(() => {
      if (engine) {
        engine.destroy();
        engine = null;
      }
    });

    return () => null; // Renders inside Shadow DOM container automatically
  },
});

export type { DevToolsConfig, DevToolsStore };

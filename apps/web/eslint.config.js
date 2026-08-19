import boundaries from 'eslint-plugin-boundaries';
import tailwind from 'eslint-plugin-tailwindcss';
import { config as reactJsConfig } from '@mobile-devtools/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...reactJsConfig,
  {
    ...tailwind.configs.recommended,
    settings: {
      tailwindcss: {
        cssConfigPath: 'src/app/globals.css',
      },
    },
    rules: {
      ...tailwind.configs.recommended.rules,
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/enforces-shorthand': 'off',
      'tailwindcss/no-unnecessary-arbitrary-value': 'off',
      'tailwindcss/no-contradicting-classname': 'error',
    },
  },
  {
    plugins: {
      boundaries,
    },
    settings: {
      tailwindcss: {
        cssConfigPath: 'src/app/globals.css',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      'boundaries/elements': [
        {
          type: 'app',
          pattern: ['src/app/**/*'],
        },
        {
          type: 'views',
          pattern: ['src/views/**/*'],
        },
        {
          type: 'widgets',
          pattern: ['src/widgets/**/*'],
        },
        {
          type: 'features',
          pattern: ['src/features/**/*'],
        },
        {
          type: 'entities',
          pattern: ['src/entities/**/*'],
        },
        {
          type: 'shared',
          pattern: ['src/shared/**/*'],
        },
      ],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          message: '{{file.type}} is not allowed to import {{dependency.type}}',
          policies: [
            {
              from: { element: { type: 'app' } },
              allow: [
                { to: { element: { type: 'views' } } },
                { to: { element: { type: 'widgets' } } },
                { to: { element: { type: 'features' } } },
                { to: { element: { type: 'entities' } } },
                { to: { element: { type: 'shared' } } },
                { to: { element: { type: 'app' } } },
              ],
            },
            {
              from: { element: { type: 'views' } },
              allow: [
                { to: { element: { type: 'widgets' } } },
                { to: { element: { type: 'features' } } },
                { to: { element: { type: 'entities' } } },
                { to: { element: { type: 'shared' } } },
                { to: { element: { type: 'views' } } },
              ],
            },
            {
              from: { element: { type: 'widgets' } },
              allow: [
                { to: { element: { type: 'features' } } },
                { to: { element: { type: 'entities' } } },
                { to: { element: { type: 'shared' } } },
                { to: { element: { type: 'widgets' } } },
              ],
            },
            {
              from: { element: { type: 'features' } },
              allow: [
                { to: { element: { type: 'entities' } } },
                { to: { element: { type: 'shared' } } },
                { to: { element: { type: 'features' } } },
              ],
            },
            {
              from: { element: { type: 'entities' } },
              allow: [
                { to: { element: { type: 'shared' } } },
                { to: { element: { type: 'entities' } } },
              ],
            },
            {
              from: { element: { type: 'shared' } },
              allow: [{ to: { element: { type: 'shared' } } }],
            },
          ],
        },
      ],
    },
  },
];

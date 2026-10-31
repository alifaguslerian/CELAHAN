import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import ts from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';

export default defineConfig([
  globalIgnores(['.next/**', '.venv/**', 'next-env.d.ts', 'test-results/**']),
  js.configs.recommended,
  ts.configs.recommended,
  {
    files: ['**/*.{ts,tsx,mts}'],
    plugins: { '@next/next': next, 'react-hooks': hooks },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      ...hooks.configs.recommended.rules,
    },
  },
]);

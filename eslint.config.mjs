// ESLint flat config — runs across all .js files in the project.
// Run with `npm run lint` (or `npx eslint .`).
//
// File layout context:
//   *.js (root)           classic browser scripts loaded via <script src=...>.
//                         They share a global lexical scope, so cross-file
//                         references (topics → inline script, etc.) need to
//                         be declared as globals to avoid no-undef.
//   api/**/*.js           Vercel Edge functions — ESM with export default.

import globals from 'globals';

// Top-level `const X = ...` in our data files (content.js, leetcode.js, etc.)
// is read across script tags via the shared classic-script global scope —
// ESLint can't see that, so don't flag these "unused" const names.
const dataFileGlobalsPattern = '^(topics|extras|leetcode|leetcodeUserOverrides|leetcodeDescriptions|namedAlgorithms|problemAlgorithms|behavioral|supermicro|systemDesignThemes|systemDesignCases)$';

export default [
  {
    ignores: ['node_modules/**', '.vercel/**', '.claude/**'],
  },
  // Default: classic browser scripts
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: dataFileGlobalsPattern,   // top-level data globals are used cross-script
      }],
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-irregular-whitespace': ['error', { skipComments: true, skipStrings: true, skipTemplates: true }],
      'no-empty': ['warn', { allowEmptyCatch: true }],
      semi: ['warn', 'always'],
    },
  },
  // Vercel Edge function — ESM with Node + Web globals available at runtime
  {
    files: ['api/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.serviceworker,
      },
    },
  },
];

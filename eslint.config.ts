import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
    js.configs.recommended,
    {
        ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.js'],
    },
    {
        files: ['**/*.ts'],
        ignores: ['**/*.config.ts'],
        languageOptions: {
            parser: tsParser,
            globals: {
                process: 'readonly',
                console: 'readonly',
                require: 'readonly',
                module: 'readonly',
                fetch: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': ts,
            prettier: prettier,
        },
        rules: {
            'no-undef': 'off', // TypeScript handles this
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
            }],
            indent: ['error', 4],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'linebreak-style': ['error', 'unix'],
            eqeqeq: ['error', 'always'],
            'max-len': ['error', { code: 120, ignoreStrings: true, ignoreTemplateLiterals: true }],
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    semi: true,
                },
            ],
        },
    },
    {
        files: ['**/*.test.ts', '**/__tests__/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            globals: {
                process: 'readonly',
                console: 'readonly',
                require: 'readonly',
                module: 'readonly',
                fetch: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                jest: 'readonly',
                global: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': ts,
            prettier: prettier,
        },
        rules: {
            'no-undef': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
            }],
            indent: ['error', 4],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'linebreak-style': ['error', 'unix'],
            eqeqeq: ['error', 'always'],
            'max-len': ['error', { code: 120, ignoreStrings: true, ignoreTemplateLiterals: true }],
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    semi: true,
                },
            ],
        },
    },
];

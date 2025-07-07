import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json'
            }
        },
        plugins: {
            '@typescript-eslint': typescriptEslint
        },
        rules: {
            'indent': ['error', 2],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'none',
                    caughtErrorsIgnorePattern: '^ignore',
                    vars: 'local',
                },
            ],
            '@typescript-eslint/no-var-requires': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            'no-useless-constructor': 'off',
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': 'off',
            '@typescript-eslint/no-useless-constructor': [
                'error',
            ],
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'variableLike',
                    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow',
                },
                {
                    selector: 'variable',
                    modifiers: ['destructured'],
                    format: null,
                },
                {
                    selector: 'parameter',
                    modifiers: ['destructured'],
                    format: null,
                },
                { selector: 'class', format: ['PascalCase'] },
                { selector: 'variable', modifiers: ['destructured'], format: null },
                { selector: 'typeParameter', format: null },
                { selector: 'enumMember', format: null },
                { selector: 'interface', format: null },
                { selector: 'property', format: null },
            ],
            'no-redeclare': 'off',
            '@typescript-eslint/no-redeclare': ['error'],
            'no-dupe-class-members': 'off',
            '@typescript-eslint/no-dupe-class-members': ['error'],
            'no-cond-assign': 'off',
            '@typescript-eslint/no-import-type-side-effects': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/ban-ts-comment': [
                'error', {
                    'ts-nocheck': false,
                },
            ],
        }
    }
];
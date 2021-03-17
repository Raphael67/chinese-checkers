module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./backend/tsconfig.json'],
    },
    env: {
        node: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    plugins: ['@typescript-eslint'],
    extends: ['eslint:recommended'],
    rules: {
        // enable additional rules
        quotes: ['warn', 'single'],
        semi: ['warn', 'always'],
        // override default options for rules from base configurations
        indent: ['error', 4],
        'comma-dangle': ['warn', 'always-multiline'],
        'no-cond-assign': ['warn', 'always'],
        'space-before-blocks': ['warn', 'always'],
        'space-before-function-paren': [
            'warn',
            {
                named: 'never',
                asyncArrow: 'always',
            },
        ],
        'arrow-spacing': [
            'warn',
            {
                before: true,
                after: true,
            },
        ],
        'space-infix-ops': [
            'warn',
            {
                int32Hint: true,
            },
        ],
        'space-unary-ops': [
            2,
            {
                words: true,
                nonwords: false,
                overrides: {
                    new: false,
                    '++': false,
                },
            },
        ],
        'semi-spacing': [
            'warn',
            {
                before: false,
                after: true,
            },
        ],
        'comma-spacing': [
            'warn',
            {
                before: false,
                after: true,
            },
        ],
        'spaced-comment': ['warn', 'always'],
        'switch-colon-spacing': [
            'error',
            {
                after: true,
                before: false,
            },
        ],

        'no-whitespace-before-property': 'warn',
        'no-trailing-spaces': 'warn',
        'key-spacing': [
            'warn',
            {
                beforeColon: false,
                afterColon: true,
                mode: 'strict',
            },
        ],
        // disable rules from base configurations
        'no-console': 'off',
        'sort-imports': 0,
        'linebreak-style': 0,
    },
    overrides: [
        {
            files: ['**/*.js'],
        },
        {
            files: ['**/*.ts'],
            extends: ['plugin:@typescript-eslint/recommended'],
            rules: {
                indent: 0,
                '@typescript-eslint/indent': [
                    'warn',
                    4,
                    {
                        ignoredNodes: ['Decorator'],
                        SwitchCase: 1,
                    },
                ],
                '@typescript-eslint/type-annotation-spacing': [
                    'warn',
                    {
                        before: true,
                        after: true,
                        overrides: {
                            colon: {
                                before: false,
                                after: true,
                            },
                        },
                    },
                ],
                '@typescript-eslint/no-explicit-any': 0,
                '@typescript-eslint/no-floating-promises': 1,
                '@typescript-eslint/no-inferrable-types': 0,
                '@typescript-eslint/explicit-member-accessibility': 1,
            },
        },
    ],
};

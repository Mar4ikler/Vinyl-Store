{
  "env": {
      "es6": true
  },
  "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/strict-type-checked",
      "prettier"
  ],
  "overrides": [],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module",
      "project": "./tsconfig.json"
  },
  "plugins": [
      "@typescript-eslint"
  ],
  "rules": {
      "no-var": "error",
      "quotes": [
          "error",
          "single",
          {
              "allowTemplateLiterals": true
          }
      ],
      "semi": [
          "error",
          "always"
      ],
      "no-console": "warn",
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": [
          "error",
          {
              "max": 1
          }
      ],
      "no-multi-spaces": "error",
      "no-mixed-spaces-and-tabs": "error",
      "no-tabs": "error",
      "prefer-const": "error",
      "no-useless-constructor": "off",
      "no-use-before-define": "error",
      "no-unsafe-optional-chaining": "warn",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/method-signature-style": "error",
      "no-array-constructor": "off",
      "@typescript-eslint/no-array-constructor": "error",
      "@typescript-eslint/no-array-delete": "error",
      "@typescript-eslint/no-for-in-array": "error",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/no-invalid-void-type": "error",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-useless-template-literals": "error",
      "@typescript-eslint/prefer-find": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/prefer-reduce-type-parameter": "warn",
      "@typescript-eslint/prefer-string-starts-ends-with": "warn",
      "@typescript-eslint/promise-function-async": "error",
      "no-return-await": "off",
      "@typescript-eslint/return-await": [
          "warn",
          "in-try-catch"
      ],
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off"
  },
  "overrides": [
      {
          "files": [
              "src/*.ts"
          ]
      }
  ]
}
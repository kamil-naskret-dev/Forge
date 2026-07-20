/** @type {import('lint-staged').Configuration} */
module.exports = {
  'apps/api/src/**/*.ts': (files) => [
    `eslint --fix --max-warnings 0 --config apps/api/eslint.config.mjs ${files.join(' ')}`,
    `prettier --write ${files.join(' ')}`,
  ],
  'apps/web/src/**/*.{ts,tsx}': (files) => [`prettier --write ${files.join(' ')}`],
  'packages/**/*.ts': (files) => [`prettier --write ${files.join(' ')}`],
  '**/*.{js,mjs,cjs,json,md,yaml,yml}': (files) => [`prettier --write ${files.join(' ')}`],
};

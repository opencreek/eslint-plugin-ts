# @opencreek/eslint-plugin-nextjs

Opinionated linting rules for nextjs Apps

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `@opencreek/eslint-plugin-nextjs`:

```sh
npm install @opencreek/eslint-plugin-nextjs --save-dev
```

```sh
yarn  add --dev @opencreek/eslint-plugin-nextjs
```

## Usage

Add `@opencreek/nextjs` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": ["@opencreek/nextjs"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@opencreek/nextjs/no-literal-hrefs": "error",
        "@opencreek/nextjs/pages-need-get-link-function-export": "error"
    }
}
```

## Supported Rules

### `@opencreek/nextjs/no-literal-hrefs`
Do not allow literal hrefs to nextjs pages

### `@opencreek/nextjs/pages-need-get-link-function-export`
Every nextjs page needs to export a getXYZLink function

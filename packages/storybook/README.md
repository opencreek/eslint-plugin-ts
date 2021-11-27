# @opencreek/eslint-plugin-storybook

Liniting ri

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `@opencreek/eslint-plugin-storybook`:

```sh
npm install @opencreek/eslint-plugin-storybook --save-dev
```

```sh
yarn  add --dev @opencreek/eslint-plugin-storybook
```

## Usage

Add `@opencreek/ts` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": ["@opencreek/ts"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@opencreek/storybook/nextjs-pages-no-default-export-function": "error"
    }
}
```

## Supported Rules


### `@opencreek/storybook/no-default-export-with-modification` Dissallows `export default function` with modiciation to the exporet value.

Because of how storybook uses acorn, and it interplays with react doc gen and default exports that have values attached, we need to always have them extra.

Fails:

```ts
export default function BlaPage() {
    //...
}

BlaPage.Layout = "layout"
```

Passes:

```ts
function BlaPage() {
    //...
}

BlaPage.Layout = "layout"

export default function BlaPage
```

```ts
export default function BlaPage() {
    //...
}
```

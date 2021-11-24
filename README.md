# @opencreek/eslint-plugin

Disalows relative path across the baseUrl of your tsconfig

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-no-relative-base-url-imports`:

```sh
npm install @opencreek/eslint-plugin --save-dev
```

```sh
yarn  add --dev @opencreek/eslint-plugin
```

## Usage

Add `@opencreek` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": ["@opencreek"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@opencreek/no-relative-imports": [
            "error",
            {
                "baseUrl": "./src"
            }
        ],
        "@opencreek/nextjs-pages-no-default-export-function": "error"
    }
}
```

## Supported Rules

### `@opencreek/no-relative-imports` Disable relative imports.

Config options

```ts
{
    "baseUrl": "./src", // The base url that you have set in the tsconfig
    "allowLocalImports": "local" // possible values: "local" | "in-base-path".
    // "local": Allows local imports (eg.: "./test")
    // "in-base-path": Allows everything that does not go back to the base url level (eg: "../../test" in "src/a/b/c/test.ts")
}

```

### `@opencreek/nextjs-pages-no-default-export-function` Dissallows `export default function` exports in nextjs pages.

Because of how storybook uses acorn, and it interplays with react doc gen and default exports that have values attached, we need to always have them extra.
This only checks files that are in a `pages` folder currently.

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

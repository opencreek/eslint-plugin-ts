# eslint-plugin-no-relative-base-url-imports

Disalows relative path across the baseUrl of your tsconfig

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-no-relative-base-url-imports`:

```sh
npm install eslint-plugin-no-relative-base-url-imports --save-dev
```

## Usage

Add `no-relative-base-url-imports` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["no-relative-base-url-imports"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "no-relative-base-url-imports/rule-name": 2
  }
}
```

## Supported Rules

- Fill in provided rules here

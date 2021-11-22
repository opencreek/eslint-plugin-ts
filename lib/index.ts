/**
 * @fileoverview Disalows relative path across the baseUrl of your tsconfig
 * @author Opencreek Technology UG
 */

import noRelativeImports from "./rules/no-relative-imports";
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
// import all rules in lib/rules

export const rules = {
  "no-relative-imports": noRelativeImports,
};

export const configs = {
  recommended: {
    plugins: ["no-relative-imports"],
    rules: {
      "no-relative-imports": "error",
    },
  },
};

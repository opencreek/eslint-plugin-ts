/**
 * @fileoverview Disalows relative path across the baseUrl of your tsconfig
 * @author Opencreek Technology UG
 */

import noRelativeImports from "./rules/no-relative-imports"
import nextjsNoDefaultExportFunction from "./rules/nextjs-pages-no-default-export-function"
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
// import all rules in lib/rules

export const rules = {
    "no-relative-imports": noRelativeImports,
    "nextjs-pages-no-default-export-function": nextjsNoDefaultExportFunction,
}

export const configs = {
    recommended: {
        rules: {
            "@opencreek/no-relative-imports": "error",
        },
    },
}

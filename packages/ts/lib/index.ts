/**
 * @fileoverview Disalows relative path across the baseUrl of your tsconfig
 * @author Opencreek Technology UG
 */

import noRelativeImports from "./rules/no-relative-imports"
import requireImportJsExtension from "./rules/require-import-js-extension"
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
// import all rules in lib/rules

export const rules = {
    "no-relative-imports": noRelativeImports,
    "require-import-js-extension": requireImportJsExtension,
}

export const configs = {
    recommended: {
        rules: {
            "@opencreek/ts/no-relative-imports": "error",
        },
    },
}

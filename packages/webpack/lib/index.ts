/**
 * @fileoverview Disalows relative path across the baseUrl of your tsconfig
 * @author Opencreek Technology UG
 */

import noDefaultExportWithModification from "./rules/no-default-export-with-notification"
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
// import all rules in lib/rules

export const rules = {
    "no-default-export-with-modification": noDefaultExportWithModification,
}

export const configs = {
    recommended: {
        rules: {
            "@opencreek/webpack/no-default-export-with-modification": "error",
        },
    },
}

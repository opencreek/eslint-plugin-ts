/**
 * @fileoverview Disalows relative path across the baseUrl of your tsconfig
 * @author Opencreek Technology UG
 */

import noLiteralHrefs from "./rules/no-literal-hrefs"
import pagesNeedGetLinkExport from "./rules/pages-need-getLink-export"
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
// import all rules in lib/rules

export const rules = {
    "no-literal-hrefs": noLiteralHrefs,
    "pages-needs-getLink-export": pagesNeedGetLinkExport,
}

export const configs = {
    recommended: {
        rules: {
            "@opencreek/nextjs/no-literal-hrefs": "error",
            "@opencreek/nextjs/pagesNeedGet": "error",
        },
    },
}

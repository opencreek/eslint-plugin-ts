import { ESLintUtils } from "@typescript-eslint/utils"
import path from "path"
import fs from "fs"

const { RuleCreator } = ESLintUtils
const creator = RuleCreator((rule) => rule)

export type Options = Record<never, never>[]

export type MessageIds = "require-import-js-extension"
export default creator<Options, MessageIds>({
    name: "require-import-js-extension",
    meta: {
        type: "problem",
        docs: {
            description: "Requires using .js extension for imports",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            "require-import-js-extension": "No relative imports",
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            ImportDeclaration(node) {
                const source = node.source.value

                if (source.indexOf(".") === -1) {
                    return
                }

                const directFileExist = fs.existsSync(
                    path.resolve(
                        path.dirname(context.getFilename()),
                        source + ".js"
                    )
                )
                const indexFileExist = fs.existsSync(
                    path.resolve(
                        path.dirname(context.getFilename()),
                        source + "/index.js"
                    )
                )

                context.report({
                    node,
                    messageId: "require-import-js-extension",
                    fix: function (fixer) {
                        if (directFileExist) {
                            return fixer.replaceText(
                                node.source,
                                `${source}.js`
                            )
                        }

                        if (indexFileExist) {
                            return fixer.replaceText(
                                node.source,
                                `${source}/index.js`
                            )
                        }

                        return null
                    },
                })
            },
        }
    },
})

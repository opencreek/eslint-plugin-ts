import { ESLintUtils } from "@typescript-eslint/utils"
import path from "path"
import fs from "fs"
import type { RuleContext } from "@typescript-eslint/utils/dist/ts-eslint/Rule"

const { RuleCreator } = ESLintUtils
const creator = RuleCreator((rule) => rule)

export type Options = Record<never, never>[]

export type MessageIds = "require-import-js-extension"
const possibleExtensions = [".js", ".jsx", ".ts", ".tsx"]

function pathExistsWithAnyExtension(
    file: string,
    context: RuleContext<"require-import-js-extension", any>
) {
    return possibleExtensions.some((it) => {
        return fs.existsSync(
            path.resolve(path.dirname(context.getFilename()), file + it)
        )
    })
}

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
            "require-import-js-extension": "Require .js extension",
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        return {
            ImportDeclaration(node) {
                const source = node.source.value

                if (possibleExtensions.some((it) => source.endsWith(it))) {
                    return
                }

                const directFileExist = pathExistsWithAnyExtension(
                    source,
                    context
                )
                const indexFileExist = pathExistsWithAnyExtension(
                    source + "/index",
                    context
                )

                if (!directFileExist && !indexFileExist) {
                    return
                }

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

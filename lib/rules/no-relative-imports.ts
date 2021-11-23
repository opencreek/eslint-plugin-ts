import { RuleCreator } from "@typescript-eslint/experimental-utils/dist/eslint-utils"
import path from "path"

const creator = RuleCreator((rule) => rule)

export type Options = {
    baseUrl?: string
    allowLocalRelativeImports?: boolean
}[]
export type MessageIds = "no-relative-import"
export default creator<Options, MessageIds>({
    name: "no-relative-imports",
    meta: {
        type: "problem",
        docs: {
            description: "Requires using non-relative imports with baseUrl",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            "no-relative-import": "No relative imports",
        },
        schema: [
            {
                type: "object",
                properties: {
                    baseUrl: {
                        type: "string",
                    },
                },
            },
        ],
    },
    defaultOptions: [
        {
            allowLocalRelativeImports: false,
        },
    ],
    create(context) {
        return {
            ImportDeclaration(node) {
                // no relative import
                if (!node.source.value.startsWith("..")) {
                    return
                }

                const fileName = context.getPhysicalFilename?.()
                const options = context.options?.[0] ?? {
                    allowLocalRelativeImports: false,
                }
                if (fileName == undefined) {
                    console.error("Got no physical file name ?!")
                    return
                }

                const basePath = path.resolve(
                    process.cwd(),
                    options.baseUrl ?? "."
                )

                const relativeFileName = fileName.replace(basePath, "")
                const levels = relativeFileName.split("/").length - 2
                const levelImport = "../".repeat(levels)

                const filePath = fileName.substring(
                    0,
                    fileName.lastIndexOf("/")
                )
                const nonRelativeImportPath = path.resolve(
                    filePath,
                    node.source.value
                )
                const isInBasePath = filePath.startsWith(basePath)
                const nonRelativeImportPathWithoutBase =
                    nonRelativeImportPath.replace(basePath + "/", "")

                // always remove imports that go past the base URL
                if (node.source.value.startsWith(levelImport) && isInBasePath) {
                    const withoutLevels = node.source.value.replace(
                        levelImport,
                        ""
                    )

                    // we go behond the baseURl
                    if (withoutLevels.startsWith("..")) return

                    context.report({
                        node: node.source,
                        messageId: "no-relative-import",
                        data: {},
                        fix: (fixer) => {
                            return fixer.replaceText(
                                node.source,
                                `"${nonRelativeImportPathWithoutBase}"`
                            )
                        },
                    })
                    return
                }

                // We report the error, if we disallow relative imports
                // Or we cross INTO the baseUrl boundary
                if (
                    options.allowLocalRelativeImports &&
                    !(
                        nonRelativeImportPath.startsWith(basePath) &&
                        !filePath.startsWith(basePath)
                    )
                ) {
                    return
                }

                context.report({
                    node: node.source,
                    messageId: "no-relative-import",
                    data: {},
                    fix: (fixer) => {
                        return fixer.replaceText(
                            node.source,
                            `"${nonRelativeImportPathWithoutBase}"`
                        )
                    },
                })

                return
            },
        }
    },
})

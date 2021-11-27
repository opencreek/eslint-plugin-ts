import { RuleCreator } from "@typescript-eslint/experimental-utils/dist/eslint-utils"
import path from "path"

const creator = RuleCreator((rule) => rule)

export type Options = {
    baseUrl?: string
    allowLocalImports?: "inside-base-path" | "local"
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
    defaultOptions: [],
    create(context) {
        return {
            ImportDeclaration(node) {
                const options = context.options?.[0] ?? {}

                // no relative import
                if (!node.source.value.startsWith(".")) {
                    return
                }

                if (
                    options.allowLocalImports === "local" ||
                    options.allowLocalImports === "inside-base-path"
                ) {
                    // We start with a "./" followed by a different char, so it's a local import
                    if (/^\.\/[^.]/.test(node.source.value)) {
                        return
                    }
                }

                const fileName = context.getPhysicalFilename?.()
                if (fileName == undefined) {
                    console.error("Got no physical file name ?!")
                    return
                }

                const basePath = path.resolve(
                    process.cwd(),
                    options.baseUrl ?? "."
                )

                const fileNameInsideBasePath = fileName.replace(basePath, "")
                const levels = fileNameInsideBasePath.split("/").length - 2
                const levelImport = "../".repeat(levels)

                const filePath = path.dirname(fileName)

                const absoluteImportPath = path.resolve(
                    filePath,
                    node.source.value
                )
                const isInBasePath = filePath.startsWith(basePath)
                const absoluteImportPathInsideBasePath =
                    absoluteImportPath.replace(basePath + "/", "")

                // we import something outside of the basePath
                if (!absoluteImportPath.startsWith(basePath)) {
                    return
                }

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
                                `"${absoluteImportPathInsideBasePath}"`
                            )
                        },
                    })
                    return
                }

                // We report the error, if we disallow relative imports
                // Or we cross INTO the baseUrl boundary
                if (
                    options.allowLocalImports == undefined &&
                    !absoluteImportPath.startsWith(basePath)
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
                            `"${absoluteImportPathInsideBasePath}"`
                        )
                    },
                })

                return
            },
        }
    },
})

import { RuleCreator } from "@typescript-eslint/experimental-utils/dist/eslint-utils"
import type {
    ExportNamedDeclaration,
    ObjectExpression,
    Property,
    ReturnStatement,
} from "estree"
import "@opencreek/ext"
import { getPackageRoot } from "../utils"
import path from "path"

const creator = RuleCreator((rule) => rule)

export type Options = Record<never, never>[]

export type MessageIds =
    | "page-need-get-link-function-export"
    | "no-return-statement"
    | "no-pathname-in-return-argument"
    | "pathname-does-not-match-page-path"

export default creator<Options, MessageIds>({
    name: "pages-need-get-link-function-export",
    meta: {
        type: "problem",
        docs: {
            description: "Pages must export a getLink function",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            "page-need-get-link-function-export":
                "Page needs a getXYZLink function export",
            "no-return-statement": "getLink function needs a return statement",
            "no-pathname-in-return-argument": "No pathname in return argument",
            "pathname-does-not-match-page-path":
                "The returned pathname ({{pathName}}) does not match the path to the page {{pagePath}}",
        },
        schema: [{}],
    },
    defaultOptions: [],
    create(context) {
        let foundLinkFunction = false

        const filename = context.getPhysicalFilename?.()

        if (filename == undefined) {
            console.error("Got no physical file name ?!")
            return
        }
        const packageBasePath = getPackageRoot(filename)

        // no page file
        const isAPage =
            !filename?.includes(path.join(packageBasePath, "/pages")) &&
            !filename?.includes(path.join(packageBasePath, "/src/pages"))

        if (isAPage) return {}

        return {
            "Program:exit"(node) {
                if (!foundLinkFunction) {
                    context.report({
                        node,
                        messageId: "page-need-get-link-function-export",
                    })
                }
            },

            ExportNamedDeclaration(node) {
                if (node.type !== "ExportNamedDeclaration") {
                    return
                }

                const definition = (node as ExportNamedDeclaration).declaration

                if (definition?.type !== "FunctionDeclaration") {
                    return
                }

                if (definition.id?.type !== "Identifier") {
                    return
                }

                // we have an incorrect name
                if (!/^get.*?Link$/.test(definition.id.name)) {
                    return
                }

                // we have a valid function
                foundLinkFunction = true

                const body = definition.body.body

                // do we want to allow multiple returns in ifs / whiles?
                const returnStatement = body.find(
                    (statement) => statement.type === "ReturnStatement"
                ) as ReturnStatement

                if (returnStatement == undefined) {
                    const reportNode = body[body.length - 1] ?? node

                    if (reportNode == undefined) {
                        return
                    }

                    context.report({
                        node: node,
                        messageId: "no-return-statement",
                    })
                }

                // no direct Object expression
                if (returnStatement?.argument?.type !== "ObjectExpression") {
                    return
                }

                const returnObject =
                    returnStatement?.argument as ObjectExpression

                const pathProperty = returnObject.properties
                    .filter((it) => it.type === "Property")
                    .map((it) => it as Property)
                    .find(
                        (it) =>
                            it.key.type === "Identifier" &&
                            it.key.name === "pathname"
                    )

                if (pathProperty == undefined) {
                    context.report({
                        node: node,
                        messageId: "no-pathname-in-return-argument",
                    })
                    return
                }

                const [_, ...pagePathSegments] = filename.split("pages")

                const pagePathWithSuffix = pagePathSegments.join("pages")
                const [pagePath] = pagePathWithSuffix.split(".")

                if (pagePath == undefined) {
                    console.error("undefined pagePath ?!")
                    return
                }

                const pageWithoutIndex = pagePath.replace("/index", "")

                if (pathProperty.value.type === "Literal") {
                    const pathValue = pathProperty.value.value

                    if (pageWithoutIndex !== pathValue) {
                        context.report({
                            node: node,
                            messageId: "pathname-does-not-match-page-path",
                            data: {
                                pathName: pathValue,
                                pagePath: pageWithoutIndex,
                            },
                        })
                        return
                    }
                }
                if (pathProperty.value.type === "TemplateLiteral") {
                    context.getSourceCode()
                    const pathValue = pathProperty.value.quasis.zip(
                        pathProperty.value.expressions
                    )

                    let rawTemplate = pathValue
                        .map(([first, second]) => {
                            if (second.type != "Identifier") {
                                // todo, better handling lol
                                throw new Error("Expected an identifier")
                            }
                            return first.value.raw + "[" + second?.name + "]"
                        })
                        .join("")

                    if (
                        pathValue.length != pathProperty?.value?.quasis?.length
                    ) {
                        rawTemplate +=
                            pathProperty?.value?.quasis?.[
                                pathProperty.value.quasis.length - 1
                            ]?.value?.raw ?? ""
                    }

                    if (pageWithoutIndex !== rawTemplate) {
                        context.report({
                            node: node,
                            messageId: "pathname-does-not-match-page-path",
                            data: {
                                pathName: rawTemplate,
                                pagePath: pageWithoutIndex,
                            },
                        })
                        return
                    }
                }
            },
        }
    },
})

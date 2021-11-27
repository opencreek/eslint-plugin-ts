import {RuleCreator} from "@typescript-eslint/experimental-utils/dist/eslint-utils"
import type {
    AssignmentExpression,
    ExpressionStatement,
    FunctionDeclaration,
    Identifier,
    MemberExpression,
    Program,
} from "@typescript-eslint/types/dist/ast-spec"

const creator = RuleCreator((rule) => rule)

export type Options = Record<never, never>[]
export type MessageIds = "no-default-export-function"
export default creator<Options, MessageIds>({
    name: "nextjs-pages-no-default-export-function",
    meta: {
        type: "problem",
        docs: {
            description: "Requires using non-relative imports with baseUrl",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            "no-default-export-function":
                "No 'default export function', because of react docgen imports.",
        },
        schema: [{}],
    },
    defaultOptions: [],
    create(context) {
        return {
            ExportDefaultDeclaration(node) {
                if (node.declaration.type === "FunctionDeclaration") {
                    const functionDeclaration =
                        node.declaration as FunctionDeclaration
                    const parent = node.parent as Program
                    if (parent == null)
                        throw new Error("Can not resolve parent")
                    const assignmentToDefault = parent.body.some((it) => {
                        if (
                            it.type !== "ExpressionStatement" ||
                            (it as ExpressionStatement).expression.type !==
                            "AssignmentExpression"
                        ) {
                            return false
                        }

                        const expression =
                            it.expression as AssignmentExpression
                        if (expression.left.type !== "MemberExpression") {
                            return
                        }
                        const left = expression.left as MemberExpression
                        if (left.object.type !== "Identifier") {
                            return
                        }

                        const identifier = left.object as Identifier
                        return (
                            functionDeclaration.id?.name === identifier.name
                        )
                    })

                    // The bug is not happening
                    if (!assignmentToDefault) {
                        return
                    }

                    context.report({
                        node: node,
                        messageId: "no-default-export-function",
                        data: {},
                        fix: (fixer) => {
                            return [
                                fixer.removeRange([
                                    node.range[0],
                                    node.range[0] +
                                    "export default ".length,
                                ]),
                                fixer.insertTextAfter(
                                    parent,
                                    `\nexport default ${functionDeclaration?.id?.name}`
                                ),
                            ]
                        },
                    })
                }
            },
        }
    },
})

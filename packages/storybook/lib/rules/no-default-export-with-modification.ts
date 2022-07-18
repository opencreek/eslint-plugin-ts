import { RuleCreator } from "@typescript-eslint/experimental-utils/dist/eslint-utils"
import type { TSESTree } from "@typescript-eslint/experimental-utils"

const creator = RuleCreator((rule) => rule)

export type Options = Record<never, never>[]
export type MessageIds = "no-default-export-function"
export default creator<Options, MessageIds>({
    name: "no-default-export-with-modification",
    meta: {
        type: "problem",
        docs: {
            description: "Disallow default export with modification",
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
                        node.declaration as TSESTree.FunctionDeclaration
                    const parent = node.parent as TSESTree.Program

                    if (parent == null)
                        throw new Error("Can not resolve parent")

                    const assignmentToDefault = parent.body.some((it) => {
                        if (
                            it.type !== "ExpressionStatement" ||
                            (it as TSESTree.ExpressionStatement).expression
                                .type !== "AssignmentExpression"
                        ) {
                            return false
                        }

                        const expression =
                            it.expression as TSESTree.AssignmentExpression
                        if (expression.left.type !== "MemberExpression") {
                            return false
                        }
                        const left =
                            expression.left as TSESTree.MemberExpression
                        if (left.object.type !== "Identifier") {
                            return false
                        }

                        const identifier = left.object as TSESTree.Identifier
                        return functionDeclaration.id?.name === identifier.name
                    })

                    // The bug is not happening
                    if (!assignmentToDefault) {
                        return false
                    }

                    context.report({
                        node: node,
                        messageId: "no-default-export-function",
                        data: {},
                        fix: (fixer) => {
                            return [
                                fixer.removeRange([
                                    node.range[0],
                                    node.range[0] + "export default ".length,
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

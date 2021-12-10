import { RuleCreator } from "@typescript-eslint/experimental-utils/dist/eslint-utils"

const creator = RuleCreator((rule) => rule)

export type Options = Record<never, never>[]

export type MessageIds = "no-literal-hrefs"
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
            "no-literal-hrefs": "No literal hrefs allowed",
        },
        schema: [{}],
    },
    defaultOptions: [],
    create(context) {
        return {
            JSXAttribute(node) {
                if (node.value == null) {
                    return
                }

                // we resolve values in `{}` as well
                const value = (() => {
                    if (node.value.type === "JSXExpressionContainer") {
                        return node.value.expression
                    }

                    return node.value
                })()

                // no literal
                if (value.type !== "Literal") {
                    return
                }
                const literalValue = value.value

                // no string
                if (typeof literalValue !== "string") {
                    return
                }

                //If we start with http (or https), we allow it to allow links to the outside
                if (literalValue.startsWith("http")) {
                    return
                }

                context.report({
                    node: value,
                    messageId: "no-literal-hrefs",
                    data: {},
                })
            },
        }
    },
})

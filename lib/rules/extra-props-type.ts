import { RuleCreator } from "@typescript-eslint/experimental-utils/dist/eslint-utils"
import type {
    FunctionDeclaration,
    Identifier,
    ObjectPattern,
    Node,
    ArrayPattern,
    AssignmentPattern,
    RestElement,
    TSParameterProperty,
    VariableDeclaration,
    ArrowFunctionExpression,
} from "@typescript-eslint/types/dist/ast-spec"
import "@opencreek/ext"

import type { RuleContext } from "@typescript-eslint/experimental-utils/dist/ts-eslint"

const creator = RuleCreator((rule) => rule)

export type Options = {
    baseUrl?: string
}[]
export type MessageIds = "standard-message"

function checkParam(
    params:
        | ArrayPattern
        | AssignmentPattern
        | Identifier
        | ObjectPattern
        | RestElement
        | TSParameterProperty,
    componentName: string | undefined,
    context: Readonly<RuleContext<MessageIds, Options>>,
    parent: Node
) {
    if (params.type === "ObjectPattern" || params.type === "Identifier") {
        const type = (params as ObjectPattern | Identifier).typeAnnotation
        if (type == null) {
            return
        }
        if (type.typeAnnotation.type === "TSTypeReference") {
            // This is just a simple type, so what we want
            return
        }

        const propName = componentName + "Props"
        context.report({
            node: type,
            messageId: "standard-message",
            data: {
                propName,
            },
            fix: ((fixer) => {
                return [
                    fixer.replaceText(type.typeAnnotation, propName),
                    fixer.insertTextBefore(
                        parent,
                        `export type ${propName} = ` +
                            context
                                .getSourceCode()
                                .getText(type.typeAnnotation) +
                            "\n"
                    ),
                ]
            }).takeIf(() => componentName != null),
        })
    }
}

function checkArrowFunction(
    context: Readonly<RuleContext<MessageIds, Options>>,
    arrowFunction: ArrowFunctionExpression,
    componentName: string | undefined,
    parent: Node
) {
    if (arrowFunction.params.length != 1) {
        // not a react component
        return
    }

    const param = arrowFunction.params[0]

    if (param == null) {
        return
    }

    checkParam(param, componentName, context, parent)
}

function checkVariableDeclaration(
    context: Readonly<RuleContext<MessageIds, Options>>,
    node: VariableDeclaration,
    parent: Node
) {
    node.declarations.map((it) => {
        if (it.init?.type === "ArrowFunctionExpression") {
            const arrowFunction = it.init as ArrowFunctionExpression

            const componentName =
                (it.id as Identifier).name
            checkArrowFunction(context, arrowFunction, componentName, parent)
        }
    })
}

function checkFunction(
    context: Readonly<RuleContext<MessageIds, Options>>,
    node: FunctionDeclaration,
    parent: Node
) {
    if (node.params.length != 1) {
        // not a react component
        return
    }

    const param = node.params[0]

    if (param == null) {
        return
    }
    const componentName = node.id?.name
    if (componentName == null) {
        return
    }
    checkParam(param, componentName, context, parent)
}

export default creator<Options, MessageIds>({
    name: "extra-props-type",
    meta: {
        type: "problem",
        docs: {
            description: "Requires using non-relative imports with baseUrl",
            recommended: "error",
        },
        fixable: "code",
        messages: {
            "standard-message":
                "You should use an extra prop type for exported components",
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
            ExportNamedDeclaration(node) {
                if (node.declaration == null) {
                    return
                }
                switch (node.declaration.type) {
                    case "FunctionDeclaration":
                        checkFunction(context, node.declaration, node)
                        break
                    case "VariableDeclaration":
                        checkVariableDeclaration(
                            context,
                            node.declaration,
                            node
                        )
                        break
                }
            },
            ExportDefaultDeclaration(node) {
                if (node.declaration == null) {
                    return
                }
                switch (node.declaration.type) {
                    case "FunctionDeclaration":
                        checkFunction(context, node.declaration, node)
                        break
                    case "ArrowFunctionExpression":
                        checkArrowFunction(
                            context,
                            node.declaration,
                            undefined,
                            node
                        )
                }
            },
        }
    },
})

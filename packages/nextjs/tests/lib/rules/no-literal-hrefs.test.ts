import noLiteralHrefs from "../../../lib/rules/no-literal-hrefs"
import { ESLintUtils } from "@typescript-eslint/experimental-utils"

const RuleTester = ESLintUtils.RuleTester

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
})

ruleTester.run("no-literal-hrefs", noLiteralHrefs, {
    valid: [
        {
            options: [],
            code: "<Link href={getLink(bla)} />",
            filename: "/src/nested/deep/test.js",
        },
        {
            options: [],
            code: '<Link href={getLink("bla")} />',
            filename: "/src/nested/deep/test.js",
        },
        {
            options: [],
            code: '<Link href="https://example.org" />',
            filename: "/src/nested/deep/test.js",
        },
        {
            options: [],
            code: '<Link href={"https://example.org"} />',
            filename: "/src/nested/deep/test.js",
        },
        {
            options: [],
            code: '<Link bla={"/example.org"} />',
            filename: "/src/nested/deep/test.js",
        },
        {
            options: [],
            code: '<Link bla="/example.org" />',
            filename: "/src/nested/deep/test.js",
        },
    ],
    invalid: [
        {
            options: [],
            code: '<Link href={"/bla"} />',
            filename: "/src/nested/deep/test.js",
            errors: [
                {
                    messageId: "no-literal-hrefs",
                },
            ],
        },
        {
            options: [],
            code: '<Link href="/bla" />',
            filename: "/src/nested/deep/test.js",
            errors: [
                {
                    messageId: "no-literal-hrefs",
                },
            ],
        },
    ],
})

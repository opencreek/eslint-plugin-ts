import nextjsNoDefaultExportFunction from "../../../lib/rules/no-default-export-with-modification"
import { ESLintUtils } from "@typescript-eslint/utils"

const { RuleTester } = ESLintUtils

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
})

import process from "process"

const spy = jest.spyOn(process, "cwd")
spy.mockReturnValue("/")

ruleTester.run(
    "nextjs-no-default-export-function",
    nextjsNoDefaultExportFunction,
    {
        valid: [
            {
                code: "export default function Test() {}",
                filename: "src/nested/deep/test.js",
            },
            {
                code: "function Test() {}\nexport default Test",
                filename: "src/pages/nested/deep/test.js",
            },
            {
                code: "export default function Test() {}",
                filename: "pages/nested/deep/test.js",
            },
        ],
        invalid: [
            {
                code: "export default function Test() {}\nTest.Layout = someLayout",
                filename: "src/pages/else/test.js",
                errors: [
                    {
                        messageId: "no-default-export-function",
                    },
                ],
                output: "function Test() {}\nTest.Layout = someLayout\nexport default Test",
            },
        ],
    }
)

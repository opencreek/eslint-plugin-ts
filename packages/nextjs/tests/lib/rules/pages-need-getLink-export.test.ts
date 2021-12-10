import { ESLintUtils } from "@typescript-eslint/experimental-utils"
import pagesNeedGetLinkExport from "../../../lib/rules/pages-need-getLink-export"

const RuleTester = ESLintUtils.RuleTester

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
})

ruleTester.run("pages-need-getLink-export", pagesNeedGetLinkExport, {
    valid: [
        {
            options: [],
            code: 'export function getLink(): UrlObject {\n return { pathname: "/nested/deep/test" }\n}',
            filename: "/pages/nested/deep/test.js",
        },
        {
            options: [],
            code: 'export function getSomePageLink(): UrlObject {\n return { pathname: "/nested/deep/test" }\n}',
            filename: "/src/pages/nested/deep/test.js",
        },
        {
            options: [],
            code: 'export function getSomePageLink(): UrlObject {\n return { pathname: "/nested/deep" }\n}',
            filename: "/src/pages/nested/deep/index.js",
        },
        {
            options: [],
            code: "export function getSomePageLink(blaId: string): UrlObject {\n return { pathname: `/nested/${blaId}/test` }\n}",
            filename: "/src/pages/nested/[blaId]/test.js",
        },
        {
            options: [],
            code: "export function getSomePageLink(blaId: string,someOtherId: string): UrlObject {\n return { pathname: `/nested/${blaId}/test/${someOtherId}` }\n}",
            filename: "/src/pages/nested/[blaId]/test/[someOtherId].tsx",
        },
        {
            options: [],
            code: "export function getSomePageLink(blaId: string): UrlObject {\n return { pathname: `/${blaId}` }\n}",
            filename: "/src/pages/[blaId].tsx",
        },
        {
            options: [],
            code: "export function getSomePageLink(blaId: string): UrlObject {\n return { pathname: `/nested/${blaId}/test` }\n}",
            filename: "/not-a-page.js",
        },
        {
            options: [],
            code: "",
            filename: "/src/nested/deep/test.js",
        },
    ],
    invalid: [
        {
            options: [],
            code: "",
            filename: "/src/pages/nested/deep/test.js",
            errors: [
                {
                    messageId: "page-need-getLink-export",
                },
            ],
        },
        {
            options: [],
            code: "",
            filename: "/pages/nested/deep/test.js",
            errors: [
                {
                    messageId: "page-need-getLink-export",
                },
            ],
        },
        {
            options: [],
            code: 'export function getSomePageLink(): UrlObject {\n return { pathname: "/nested/deep/test" }\n}',
            filename: "/pages/wrong/path.js",
            errors: [
                {
                    messageId: "pathname-does-not-match-page-path",
                },
            ],
        },
        {
            options: [],
            code: "export function getSomePageLink(blaId: string): UrlObject {\n return { pathname: `/nested/${blaId}/test` }\n}",
            filename: "/src/pages/nested/[wrong]/test.js",
            errors: [
                {
                    messageId: "pathname-does-not-match-page-path",
                },
            ],
        },
    ],
})

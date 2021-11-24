import extraPropsType from "../../../lib/rules/extra-props-type"
import { ESLintUtils } from "@typescript-eslint/experimental-utils"

const RuleTester = ESLintUtils.RuleTester

const ruleTester = new RuleTester({
    parser: "@typescript-eslint/parser",
})

ruleTester.run("extra-props-type", extraPropsType, {
    valid: [
        // function components
        {
            code: "export function TestComponent(props: TestComponentProps) {}",
        },
        {
            code: "export default function TestComponent(props: TestComponentProps) {}",
        },
        {
            code: "function TestComponent(props: TestComponentProps) {}",
        },
        {
            code: "function TestComponent(props: {children: ReactNode}) {}",
        },
        // arrow components
        {
            code: "export const TestComponent = (props: TestComponentProps) => {}",
        },
        {
            code: "export default (props: TestComponentProps) => {}",
        },
        {
            code: "const TestComponent = (props: TestComponentProps) => {}",
        },
        {
            code: "const TestComponent = (props: {children: ReactNode}) => {}",
        },
    ],
    invalid: [
        // functions components
        {
            code: "export function TestComponent(props: {children: ReactNode}) {}",
            errors: [
                {
                    messageId: "standard-message",
                },
            ],
            output: "export type TestComponentProps = {children: ReactNode}\nexport function TestComponent(props: TestComponentProps) {}",
        },
        {
            code: "export default function TestComponent(props: {children: ReactNode}) {}",
            errors: [
                {
                    messageId: "standard-message",
                },
            ],
            output: "export type TestComponentProps = {children: ReactNode}\nexport default function TestComponent(props: TestComponentProps) {}",
        },
        {
            code: "export function TestComponent({children}: {children: ReactNode}) {}",
            errors: [
                {
                    messageId: "standard-message",
                },
            ],
            output: "export type TestComponentProps = {children: ReactNode}\nexport function TestComponent({children}: TestComponentProps) {}",
        },
        // arrow components
        {
            code: "export const TestComponent = (props: {children: ReactNode}) => {}",
            errors: [
                {
                    messageId: "standard-message",
                },
            ],
            output: "export type TestComponentProps = {children: ReactNode}\nexport const TestComponent = (props: TestComponentProps) => {}",
        },
        {
            code: "export default (props: {children: ReactNode}) => {}",
            filename: "TestComponent.tsx",
            errors: [
                {
                    messageId: "standard-message",
                },
            ],
            output: null
        },
        {
            code: "export const TestComponent = ({children}: {children: ReactNode}) => {}",
            errors: [
                {
                    messageId: "standard-message",
                },
            ],
            output: "export type TestComponentProps = {children: ReactNode}\nexport const TestComponent = ({children}: TestComponentProps) => {}",
        },
    ],
})

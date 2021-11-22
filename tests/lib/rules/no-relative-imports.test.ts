import noRelativeImports from "../../../lib/rules/no-relative-imports";
import { ESLintUtils } from "@typescript-eslint/experimental-utils";

const RuleTester = ESLintUtils.RuleTester;

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
});

ruleTester.run("my-rule", noRelativeImports, {
  invalid: [
    {
      code: 'import {foo} from "bla"',
      errors: [
        {
          messageId: "test",
        },
      ],
    },
  ],
  valid: [],
  // invalid: [
  //   {
  //     code: 'import {foo} from "bla"',
  //   },
  //   {
  //     code: 'import {foo} from "test"',
  //     options: [
  //       {
  //         baseUrl: "src",
  //       },
  //     ],
  //   },
  // ],
  //
  // valid: [],
});

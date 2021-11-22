import noRelativeImports from "../../../lib/rules/no-relative-imports";
import { ESLintUtils } from "@typescript-eslint/experimental-utils";

const RuleTester = ESLintUtils.RuleTester;

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
});

const process = require("process");

const spy = jest.spyOn(process, "cwd");
spy.mockReturnValue("/");

ruleTester.run("my-rule", noRelativeImports, {
  invalid: [
    {
      options: [{ baseUrl: "./src" }],
      code: 'import {foo} from "../../bla/test"',
      filename: "/src/nested/deep/test.js",
      errors: [
        {
          messageId: "test",
        },
      ],
      output: 'import {foo} from "bla/test"',
    },
  ],
  valid: [
    {
      options: [{ baseUrl: "./src" }],
      code: 'import {foo} from "bla/test"',
      filename: "/src/nested/deep/test.js",
    },
      {
          options: [{ baseUrl: "./src" }],
          code: 'import {foo} from "../../../bla/test"',
          filename: "/src/nested/deep/test.js",
      },
    {
      options: [{ baseUrl: "./src" }],
      code: 'import {foo} from "../bla/test"',
      filename: "/src/nested/deep/test.js",
    },
  ],
});

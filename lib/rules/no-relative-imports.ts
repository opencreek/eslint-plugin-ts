import { RuleCreator } from "@typescript-eslint/experimental-utils/dist/eslint-utils";

const creator = RuleCreator((rule) => rule);

export type Options = {
  baseUrl?: string;
}[];
export type MessageIds = "test";
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
      test: "test",
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
  create(context, options) {
    return {
      ImportDeclaration(node) {
        const fileName = context.getPhysicalFilename?.();
        if (fileName == undefined) {
          console.error("Got no physical file name ?!");
          return;
        }
        console.log("==============================\nfilename: ");
        console.log(fileName);
        const relativeFileName = fileName.replace(__dirname, "");
        const levels = relativeFileName.split("/").length - 1;
        console.log(relativeFileName);
        console.log(levels);
        if (node.source.value.startsWith("../".repeat(levels))) {
          context.report({
            node: node,
            messageId: "test",
            data: {},
          });
        }
        console.dir(context);
        console.dir(options);
        console.dir(node);
      },
    };
  },
});

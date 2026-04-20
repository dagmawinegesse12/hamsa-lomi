import next from "eslint-config-next";
import unicorn from "eslint-plugin-unicorn";

export default [
  ...next,
  {
    plugins: { unicorn },
    rules: {
      "unicorn/prefer-node-protocol": "error",
      "unicorn/no-null": "off"
    }
  }
];

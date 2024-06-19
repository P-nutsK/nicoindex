// @ts-check
const nextPlugin = require("@next/eslint-plugin-next");
const reactPlugin = require("eslint-plugin-react");
const hooksPlugin = require("eslint-plugin-react-hooks");
const compilerPlugin = require("eslint-plugin-react-compiler");
// @ts-ignore
const typescriptParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");
const { default: ts, config } = require("typescript-eslint");
const globals = require("globals");

module.exports = config(
	{
		languageOptions: {
			parser: typescriptParser,
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021,
				React: true,
			},
			parserOptions: {
				project: "./tsconfig.json",
			},
		},
		files: ["**/*.{js,jsx,ts,tsx}"],
		plugins: {
			react: reactPlugin,
			"react-hooks": hooksPlugin,
			"@next/next": nextPlugin,
			"react-compiler": compilerPlugin,
		},
		rules: {
			...js.configs.recommended.rules,
			...reactPlugin.configs["jsx-runtime"].rules,
			...hooksPlugin.configs.recommended.rules,
			...nextPlugin.configs.recommended.rules,
			...nextPlugin.configs["core-web-vitals"].rules,
			"@next/next/no-img-element": "error",
			"react-compiler/react-compiler": "error",
		},
	},
	...ts.configs.recommendedTypeChecked,
	{
		rules: {
			"@typescript-eslint/ban-types": [
				"error",
				{
					types: {
						"{}": false,
					},
				},
			],
		},
	},

	{
		ignores: [
			"./.next/**/*",
			"node_modules",
			"eslint.config.js",
			"**/*.module.css.d.ts",
			"postcss.config.js",
			"**/*.bun.ts",
		],
	},
);

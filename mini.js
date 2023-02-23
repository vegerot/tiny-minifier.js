

import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
Deno.test("minify spaces in assignment", () => {
	const code = `let a = 1;`
	const minified = minify(code)
	assertEquals(minified, `let a=1;`)
})

Deno.test("minifiy const", () => {
	const code = `const hello='world';`
	const minified = minify(code)
	assertEquals(minified, `let hello='world';`)
})

Deno.test("minify spaces in function arguments", () => {
	const code = `function hello (a, b)`
	const minified = minify(code)
	assertEquals(minified, `function hello(a,b)`)
})

Deno.test("minify multiple lines", () => {
	const code = `let a=1;
					const hello='world';
				function hello(a,b)`
	const minified = minify(code)
	assertEquals(minified, `let a=1;let hello='world';function hello(a,b)`)
})

function minify(code) {
	/** transformations*/
	let ts = [minifySpacesInAssignment, minifyConst, minifySpacesInFunctionArguments, minifyMultipleLines]
	ts.forEach(t => code = t(code))
	return code
}

function minifySpacesInAssignment(code) {
	return code.replace(/let (\w[\d\w]*)\s*=\s*(.*$)/g, 'let $1=$2')
}

function minifyConst(code) {
	return code.replace(/const/g, 'let')
}

function minifySpacesInFunctionArguments(code) {
	let noSpacesBetweenParens = code.replace(/function (\w[\d\w]*)\s*\(([\w\s,]*)\)/g, 'function $1($2)')
	return noSpacesBetweenParens.replace(/\((\w+),\s*(\w+)\)/g, '($1,$2)')
}

function minifyMultipleLines(code) {
	return code.replace(/\n\s*/g, ';').replace(/;;/g, ';')
}

/*
#FEATURES:
- [x] minify spaces in assignment
- [x] minify const
- [] minify spaces in function arguments

 */
if (typeof Deno !== "undefined") {
	const {assertEquals} = await import( "https://deno.land/std@0.177.0/testing/asserts.ts")
	Deno.test("minify spaces in assignment", () => {
		{
			const code = `let a = 1;`
			const minified = minify(code)
			assertEquals(minified, `let a=1;`)
		}

		{
			const code = `aoeu = 69;`
			const minified = minify(code)
			assertEquals(minified, `aoeu=69;`)
		}
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

	Deno.test("minify function", () => {
		const code = `function hello(a,b){
return a+b
}`
		const minified = minify(code)
		// TODO: weird
		assertEquals(minified, `function hello(a,b){;return a+b;}`)
	})

	Deno.test('minify all', () => {
		const code = `let a = 1;
						  const hello = 'world';
					function hello (a, b)`
		const minified = minify(code)
		assertEquals(minified, `let a=1;let hello='world';function hello(a,b)`)
	})
}

export function minify(code) {
	/** transformations*/
	const ts = [minifyMultipleLines, minifyConst, minifySpacesInAssignment, minifySpacesInFunctionArguments]
	ts.forEach(t => code = t(code))
	return code
}

function minifySpacesInAssignment(code) {
	return code.replace(/(\w[\d\w]*)\s*=\s*(.*?);/g, '$1=$2;')
}

function minifyConst(code) {
	return code.replace(/const/g, 'let')
}

function minifySpacesInFunctionArguments(code) {
	const noSpacesBetweenParens = code.replace(/function (\w[\d\w]*)\s*\(([\w\s,]*)\)/g, 'function $1($2)')
	return noSpacesBetweenParens.replace(/\((\w+),\s*(\w+)\)/g, '($1,$2)')
}

function minifyMultipleLines(code) {
	return code.replace(/\n\s*/g, ';').replace(/;;/g, ';')
}

/*
#FEATURES:
- [x] minify spaces in assignment
- [x] minify const
- [x] minify spaces in function arguments
- [x] minify multiple lines
- [x] minify function

 */

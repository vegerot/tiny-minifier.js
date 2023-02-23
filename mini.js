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
		/*{
			const code = `aoeu = 69`
			const minified = minify(code)
			assertEquals(minified, `aoeu=69;`)
		}*/
	})

	Deno.test("minifiy const", () => {
		const code = `const hello='world';`
		const minified = minify(code)
		assertEquals(minified, `let hello='world';`)
	})

	Deno.test("minify spaces in function arguments", () => {
		{
			const code = `function hello (a, b)`
			const minified = minify(code)
			assertEquals(minified, `function hello(a,b)`)
		}
		{
			const code = `function hello (a, b, c, d)`
			const minified = minify(code)
			assertEquals(minified, `function hello(a,b,c,d)`)
		}
	})

	Deno.test("minify whitespace between comma-separated identifiers", () => {
		const code = `a, b, c,   d`
		const minified = minify(code)
		assertEquals(minified, `a,b,c,d`)
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
return a+b;
}`
		const minified = minify(code)
		assertEquals(minified, `function hello(a,b){return a+b;}`)
	})

	Deno.test('minify all', () => {
		const code = `let a = 1;
						  const hello = 'world';
					function hello (a, b)`
		const minified = minify(code)
		assertEquals(minified, `let a=1;let hello='world';function hello(a,b)`)
	})
}

function minify(code) {
	const ts = [minifyMultipleLines, minifyConst, minifySpacesInAssignment, minifyWhitespaceInCommas, minifySpacesInFunctionArguments];
	ts.forEach(t => code = t(code));
	return code;
	function minifySpacesInAssignment(code) {
		return code.replace(/(\w[\d\w]*)\s*=\s*(.*?);/g, '$1=$2;');
	}

	function minifyConst(code) {
		return code.replace(/const/g, 'let');
	}

	function minifyWhitespaceInCommas(code) {
		return code.replace(/,\s+/g, ',');
	}

	function minifySpacesInFunctionArguments(code) {
		return code.replace(/function (\w[\d\w]*)\s*\(([\w\s,]*)\)/g, 'function $1($2)');
	}

	function minifyMultipleLines(code) {
		return code
			.replace(/;\n\s*/g, ';')
			.replace(/;;/g, ';')
			.replace(/{\n\s*/gm, '{');
	}
}

export function bootstrap() {
		d.insertAdjacentHTML('afterbegin', `<textarea id="input" rows=20 cols=80 placeholder="const a = function foo (c, d){}">`)
		d.insertAdjacentHTML('beforeend', `<textarea id="output" rows=20 cols=80 wrap="off" disabled>`)

		let input = document.getElementById('input')
		let output = document.getElementById('output')

		input.oninput = (event) => {
			output.value = minify(event.target.value)
		}
}


/*
#FEATURES:
- [x] minify spaces in assignment
- [x] minify const
- [x] minify spaces in function arguments
  - [x] minify spaces with >3 function arguments
- [x] minify multiple lines
- [x] minify function

# examples

```js
const a = 1;

const func = function foo (c, d) {};

for (let i=0; i< range(10, 20 ); ++i) {
	console.log(`hello, ${i}`, i);
}
```
 */

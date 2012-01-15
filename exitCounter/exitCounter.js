// Copyright (C) 2011 Luca Colantonio <luca.colantonio@gmail.com>

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
*	A simple utility to call a function after a predifined amount of times soemthing has happened.
*	Input args is an object:
*	{
*		count: the amount of times we are intersted into
*		onExit: the callback to be called when the count has been reached
*		sync: boolean representing whether the callback should be called synchronously or asynchronously (the default)
*	}
*/
var exitCounter = function ( args ) {
	if( !args.count || typeof args.count !== "number" ||
			!args.onExit || typeof args.onExit !== "function" ||
				args.sync && typeof args.sync !== "boolean") {
		throw new Error('ParametersError');
	}

	return {
		/**
		*	decrease of release times the count passed in at construction town.
		*	release can be any number, even 0
		*/
		decrement: function( release ) {
			var howMany = release === undefined ? 1 : release;

			if( typeof howMany !== "number") {
				throw new Error('ParametersError');
			}

			args.count -= howMany;

			if( 0 === args.count ) {
				(args.sync ? args.onExit : function() { setTimeout( args.onExit, 0 ); })();
			} else if( args.count < 0 ) {
				throw new Error('Released too many times');
			}
		}
	};
};

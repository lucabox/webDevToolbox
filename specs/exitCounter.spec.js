describe('exitCounter', function() {
	it('should not accept invalid input', function() {
		//no arguments passed in
		expect( function() { exitCounter({}); } ).toThrow('ParametersError');
		//no callback provided
		expect( function() { exitCounter({count: 1}); } ).toThrow('ParametersError');
		//callback paramenter not a function
		expect( function() { exitCounter({count:1, onExit:"a"});} ).toThrow('ParametersError');
		//callback paramenter not a function
		expect( function() { exitCounter({count:1, onExit:1}); }).toThrow('ParametersError');
		//sync not a boolean
		expect( function() { exitCounter({count:1, onExit:function(){}, sync:"nonexisting"}); }).toThrow('ParametersError');
		//release not a number
		expect( function() { exitCounter({count:1, onExit:function(){}}).decrement("something"); } ).toThrow('ParametersError');
	});
	it('should throw if released too many times', function() {
		var counter = exitCounter({count:5, onExit:function(){}} );
		counter.decrement(1);
		counter.decrement(0);
		expect( function() { counter.decrement(5); } ).toThrow('Released too many times');
	});
	it('should raise sync events', function() {
		var increment = 0,
			exitFn = function(){
				++increment;
			},
			counter1 = exitCounter({count:2, onExit: exitFn, sync: true});
			counter2 = exitCounter({count:2, onExit: exitFn, sync: true});

			counter1.decrement(1);
			counter1.decrement();
			expect(increment).toEqual(1);
		
			counter2.decrement(0);
			counter2.decrement(2);
			expect(increment).toEqual(2);
	});
	it('should raise async events', function() {
		var increment = 0,
			exitFn = function(){
				++increment;
			},
			asyncCounter = exitCounter({count:2, onExit:exitFn, sync: false}),
			syncCounter = exitCounter({count:2, onExit:exitFn, sync: true});

			asyncCounter.decrement(1);
			asyncCounter.decrement(1);
			expect(increment).toEqual(0);
		
			syncCounter.decrement(0);
			syncCounter.decrement(2);
			expect(increment).toEqual(1);

			waitsFor( function() {
				return increment === 2;
			}, "event Never Received", 10000);

			runs ( function() {
				expect(increment).toEqual(2);
			});
	});
});

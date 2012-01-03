describe('exitCounter', function() {
	it('should not accept invalid input', function() {
		expect( function() { exitCounter(); } ).toThrow('ParametersError');
		expect( function() { exitCounter(1); } ).toThrow('ParametersError');
		expect( function() { exitCounter("1", function(){}); } ).toThrow('ParametersError');
		expect( function() { exitCounter(1,"a"); } ).toThrow('ParametersError');
		expect( function() { exitCounter(1,1); } ).toThrow('ParametersError');
		expect( function() { exitCounter(1,1, "nonexisting"); } ).toThrow('ParametersError');
		expect( function() { exitCounter(1, function(){}).exit("something"); } ).toThrow('ParametersError');
	});
	it('should throw if released too many times', function() {
		var counter = exitCounter(5, function(){} );
		counter.exit(1);
		counter.exit(0);
		expect( function() { counter.exit(5); } ).toThrow('Released too many times');
	});
	it('should raise sync events', function() {
		var increment = 0,
			exitFn = function(){
				++increment;
			},
			counter1 = exitCounter(2, exitFn ),
			counter2 = exitCounter(2, exitFn, exitCounter.sync);

			counter1.exit(1);
			counter1.exit();
			expect(increment).toEqual(1);
		
			counter2.exit(0);
			counter2.exit(2);
			expect(increment).toEqual(2);
	});
	it('should raise async events', function() {
		var increment = 0,
			exitFn = function(){
				++increment;
			},
			asyncCounter = exitCounter(2, exitFn, exitCounter.async),
			syncCounter = exitCounter(2, exitFn, exitCounter.sync);

			asyncCounter.exit(1);
			asyncCounter.exit(1);
			expect(increment).toEqual(0);
		
			syncCounter.exit(0);
			syncCounter.exit(2);
			expect(increment).toEqual(1);

			waitsFor( function() {
				return increment == 2;
			}, "event Never Received", 10000);

			runs ( function() {
				expect(increment).toEqual(2);
			});
	});
});
var ExampleObservable = Observable.extend({
	initEvents: function() {
		this._super([ 'event1', 'event2', 'event3']); 
	}
});

describe('Observable', function() {
	it('should not accept invalid input', function() {
		var observableInstance = new ExampleObservable();
		//no observer passed in
		expect( function() { observableInstance.addObserver(); } ).toThrow('ParametersError');
		//no callback passed in
		expect( function() { observableInstance.addObserver( 'event1' ); } ).toThrow('ParametersError');
	});

	it('should not accept unknown events', function() {
		var observableInstance = new ExampleObservable(),
			callback = function() {},
			nonExistingEvent = 'nonExistingEvent';
		expect( function() { observableInstance.addObserver( nonExistingEvent, callback ); } ).toThrow('UnkownEvent: ' + nonExistingEvent);
		expect( function() { observableInstance.notifyObservers( nonExistingEvent ); } ).toThrow('UnkownEvent: ' + nonExistingEvent);
		expect( function() { observableInstance.removeObserver( nonExistingEvent ); } ).toThrow('UnkownEvent: ' + nonExistingEvent);
		expect( function() { observableInstance.clearEventObservers( nonExistingEvent ); } ).toThrow('UnkownEvent: ' + nonExistingEvent);
	});

	it('should always give a unique observer id', function() {
		var observableInstance = new ExampleObservable(),
			callback = function() {},
			observerId1 = observableInstance.addObserver( 'event1', callback ),
			observerId2 = observableInstance.addObserver( 'event1', callback ),
			observerId3 = observableInstance.addObserver( 'event2', callback );

		//checking Ids
		expect(observerId1).toBeTruthy();
		expect(observerId2).toBeGreaterThan(observerId1);
		expect(observerId3).toBeGreaterThan(observerId2);
	});

	it('should be able to remove existing observers', function() {
		var observableInstance = new ExampleObservable(),
			counter = 0,
			callback = function() {
				++counter;
			},
			observerId1 = observableInstance.addObserver( 'event1', callback ),
			observerId2 = observableInstance.addObserver( 'event1', callback ),
			observerId3 = observableInstance.addObserver( 'event2', callback ),
			observerId4 = observableInstance.addObserver( 'event2', callback ),
			observerId5 = observableInstance.addObserver( 'event2', callback );

		expect( observableInstance.removeObserver( 'event1', observerId1 ) ).toBe(true);
		observableInstance.notifyObservers('event1');
		expect(counter).toEqual(1);

		expect( observableInstance.removeObserver( 'event2', observerId3 ) ).toBe(true);
		expect( observableInstance.removeObserver( 'event2', observerId3 ) ).toBe(false);
		observableInstance.notifyObservers('event2');
		expect(counter).toEqual(3);

		observableInstance.clearEventObservers('event1');
		expect( observableInstance.removeObserver( 'event1', observerId2 ) ).toBe(false);
		observableInstance.notifyObservers('event1');
		expect(counter).toEqual(3);

		observableInstance.clearAllObservers();
		expect( observableInstance.removeObserver( 'event2', observerId4 ) ).toBe(false);
		expect( observableInstance.removeObserver( 'event2', observerId5 ) ).toBe(false);

		observableInstance.notifyObservers('event1');
		observableInstance.notifyObservers('event2');
		expect(counter).toEqual(3);
	});

	it('should be able to raise async events', function() {
		var observableInstance = new ExampleObservable(),
			counter = 0,
			eventsReceived = false,
			handleEvent = function() {
				++counter;
				eventsReceived = counter === 2;
			};
		observableInstance.addObserver( 'event1', handleEvent, this, observableInstance.async );
		observableInstance.notifyObservers('event1');
		expect(counter).toEqual(0);
		observableInstance.addObserver( 'event2', handleEvent, this, observableInstance.async );
		observableInstance.notifyObservers('event2');
		expect(counter).toEqual(0);

		waitsFor( function() {
			return eventsReceived;
		}, "events Never Received", 10000);

		runs ( function() {
			expect(counter).toEqual(2);
		});
	});

	it('should be able to raise sync events', function() {
		var observableInstance = new ExampleObservable(),
			counter = 0,
			handleEvent = function() {
				++counter;
			};
		observableInstance.addObserver( 'event1', handleEvent );
		observableInstance.notifyObservers('event1');
		expect(counter).toEqual(1);

		observableInstance.addObserver( 'event2', handleEvent, this,  observableInstance.sync );
		observableInstance.notifyObservers('event2');
		expect(counter).toEqual(2);

		observableInstance.notifyObservers('event1');
		expect(counter).toEqual(3);
	});
});

// Copyright (C) 2011 Luca Colantonio <luca.colantonio@gmail.com>
// Copyright (C) 2011 Jean-Francois Moy <jeanfrancois.moy@gmail.com>

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

Observable = Class.extend({
	autoIncrement: 0,
	/**
	*	Events that clients can observe
	*/
	events: [],

	/**
	*	Store the observers
	*	{
	*		event: [observer1, observer2 .... ]	
	*	}
	*/
	observers: {},

	/**
	*	Initialize the events associated to this Obversable.
	*/
	init: function() {
		this.initEvents();
		this.sync = 'sync';
		this.async = 'async';
	},

	/**
	*	Init the events that can be fired by this instance
	*	of Observable.
	*	@tparam Array events an array of Strings declaring the events' names
	*/
	initEvents: function(events) {
		for (var i = 0; i < events.length; i++) {
			var event = events[i];
			this.observers[event] = [];
		}	
	},

	/**
	*	Add an observer for a specific event, associating a
	*	function that should be called when triggered. The
	*	context is used as a scope for the callback otherwise,
	*	this is used.
	*	@tparam String event The event to be observed
	*	@tparam Function fn The callback that will be invoked
	*	@tparam Object context The context to be applied when invoking the callback
	*	@tparam String connection Specify whether the callback will be called synchronously ('sync') or asynchronously ('async')
	*/
	addObserver: function( event, fn, context, connection ) {
		if (!event || !fn ) { throw new Error('ParametersError'); }

		var eventObservers = this.observers[event];
		
		if (!eventObservers) { throw new Error('UnkownEvent: ' + event); }

		var observerId = ++this.autoIncrement;
		eventObservers.push({
			id: observerId,
			eventFn: fn,
			scope: context || this,
			connection: connection || this.sync
		});

		return observerId;
	},

	/**
	*	Notify the observers for the event provided,
	*	Additional event data can be optionally passed to the observer.
	*/
	notifyObservers: function(event, data) {
		var eventObservers = this.observers[event],
			observersCount,
			observer,
			i;

		if (!eventObservers) { throw new Error('UnkownEvent: ' + event); }

		observersCount = eventObservers.length;
		for ( i = 0; i < observersCount; i++ ) {
			observer = eventObservers[i];
			if( this.sync === observer.connection ) {
				observer.eventFn.call(observer.scope, data);
			} else {
				setTimeout( function() {
					observer.eventFn.call(observer.scope, data);
				}, 0);
			}
		}
		return observersCount;
	},

	/**
	*	Remove a specific observer for the provided event. Returns
	*	true or false depending if the removal correctly occured.
	*/
	removeObserver: function(event, id) {
		var eventObservers = this.observers[event],
			observersCount,
			i;
		
		if (!eventObservers) { throw new Error('UnkownEvent: ' + event); }

		observersCount = eventObservers.length;
		for ( i = 0; i < observersCount; i++ ) {
			if (eventObservers[i].id === id) {
				eventObservers.splice(i, 1);
				return true;
			}		
		}

		return false;
	},

	/**
	*	Clear all observers for this observable objects.
	*/
	clearAllObservers: function() {
		this.observers = {};
		this.initEvents(this.events);
	},

	/**
	*	Clear all observers for a specific event.
	*/
	clearEventObservers: function(event) {
		if (!this.observers[event]) { throw new Error('UnkownEvent: ' + event); }
		this.observers[event] = [];
	}
});

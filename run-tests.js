// Jasmine lib & reporter
phantom.injectJs("./lib/jasmine/jasmine.js");
phantom.injectJs("./lib/jasmine/jasmine-console.js");

//TODO: find a better (automated?) way
//loading js code to be tested
phantom.injectJs("./class/class.js");
phantom.injectJs("./observable/observable.js");

//read all the specs in the test folder
var fs = require('fs');
var testls = fs.list('./specs');
for( var index in testls ) {
	if ( testls[index].match('.spec.js') ) {
		phantom.injectJs('./specs/' + testls[index]);
	}
}

var jasmineEnv = jasmine.getEnv();
jasmineEnv.addReporter(new jasmine.ConsoleReporter(function(msg){
    // Print messages straight to the console
    console.log(msg.replace('\n', ''));
}, function(reporter){
    // On complete
    phantom.exit(reporter.results().failedCount);
}, true));

// Launch tests
jasmineEnv.updateInterval = 1000;
jasmineEnv.execute();
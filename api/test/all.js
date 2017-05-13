/**
    This file serves as a harness for all other tests. By requiring them, they are executed in the order defined here.
    When running mocha, run mocha tests/all.js

    Note: it is possible that we're sending too many requests too quickly. If that's found to be the case, we can add
    --delay to mocha.opts which injects a global function called run() into our suites. Then we can run a timeout and call run
    after x milliseconds has passed, thus slowing down the execution order of our tests. We MAY need to adjust the --timeout flag
    if this happens. See http://www.mochajs.org.
**/

require('./logout.js'); //run logout first to force-generate a new token for all subsequent calls
require('./login.js');
require('./register.js');
require('./user.js');
require('./stats.js');
require('./steps.js'); //this can only be run once per day atm without the server complaining...

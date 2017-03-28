/**
    This file serves as a harness for all other tests. By requiring them, they are executed in the order defined here.
    When running mocha, run mocha tests/all.js
**/

require('./logout.js'); //run logout first to force-generate a new token for all subsequent calls
require('./login.js');
//require('./register.js');
//require('./user.js');
require('./steps.js');

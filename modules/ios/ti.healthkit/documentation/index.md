# ti.healthkit Module

## Description

This module exposes a subset of the iOS HealthKit api for consumption by the 10K Steps Appcelerator Alloy app.

## Accessing the ti.healthkit Module

To access this module from JavaScript, you would do the following:

    var ti_healthkit = require("ti.healthkit");

The ti_healthkit variable is a reference to the Module object.

## Reference

### ti_healthkit.authoriseHealthKit(cb);
Accepts a callback with a single parameter and no return value.
The argument passed to the callback will be a `response` with the following schema:

```
{
	"success": bool,
	"message": string
}
```

### ti_healthkit.querySteps(from, to, cb);

`from`: `Date` object representing the lower bound.
`to`: `Date` object representing the upper bound.
`cb`: A callback function with a single parameter and no return value. The argument passed to the callback will be a `response` with the following schema:

```
{
	"success": bool,
	"message": string,
	"result": [{
		"steps": int,
		"eventDate": timestamp(int)
	}]
}
```

## Usage

```
			healthkit.authoriseHealthKit(function(response) {
				Ti.API.info('healthkit authoriseHealthKit got response!');
				Ti.API.info(response);
				Ti.API.info('message: ' + response.message);

				var from = new Date(0); // 01/01/1970
				var to = new Date(); // today

				healthkit.querySteps(from, to, function(response) {
					Ti.API.info('healthkit query steps got response!');
					Ti.API.info(response);
				});
			});
```

## Author

Jason Sultana for AppsoluteIT.

## License

All rights reserved.
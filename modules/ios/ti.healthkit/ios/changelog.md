# Ti.HealthKit Changelog

### v1.0.3
Refactor HealthKitProvider so that the callback also contains a success flag. Refactor HealthKitModule so that this flag gets passed to the calling code to correctly indicate success or failure (instead of having to rely on the absence of an error message).

### v1.0.2
Customise JSON encoder to serialise targeting the UNIX epoch instead of the reference date (01/01/2001).

### v1.0.1
Standardise response format to include success (bool), message (string) and results (optional)

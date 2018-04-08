<p style="color: red;">Note: This API doc has been antiquated. Please visit https://www.10000steps.org.au/api/, login with any account that has
registered to 10,000 Steps and view the Django API documentation there. You do not need special accounts to browse the API doc; any account that is able to use
the app / login the website can view the API</p>

# 10,000 Steps API Reference
This is an attempt to document the new 10000 steps API for future reference.

Note: Any of the endpoints can return a common response indicating that the authenticaton token has expired, in the form of:

#### Returns ####
| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `detail` | `string` | `Invalid token.` | Indicates that the provided auth token has expired. Login must be called again |

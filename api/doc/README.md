# 10,000 Steps API Reference
This is an attempt to document the new 10000 steps API for future reference.

Note: Any of the endpoints can return a common response indicating that the authenticaton token has expired, in the form of:

#### Returns ####
| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `detail` | `string` | `Invalid token.` | Indicates that the provided auth token has expired. Login must be called again |

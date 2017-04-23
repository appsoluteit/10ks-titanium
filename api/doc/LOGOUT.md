{% method -%}
## Logout {#logout}

Call this to manually reset the authorization token associated with a user, so calling login will regenerate a new token.

```
https://www.10000steps.org.au/api/auth/logout/
```

### POST ###
#### Headers ####
| Name | Type | Required | Sample |
| -- | -- | -- | -- |
| `Authorization` | `string` | `true` | `Token 6a80f3bdb886f15225e99d1cee2c0bce4a6d60d9` |

#### Returns ####
| Name | Type | Sample |
| -- | -- | -- | -- |
| `detail` | `string` | `Successfully logged out` |

{% endmethod %}

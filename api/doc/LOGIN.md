{% method -%}
## Login {#login}

Call this to login to the application and get an authorization token. The token is required for all subsequent calls to the API.
```
https://www.10000steps.org.au/api/auth/login/
```

Authorisation tokens will expire after ??? minutes. When this happens, endpoints will respond with:

| Name     | Type     | Sample              |
| ---      | ---      | ---                 |
| `detail` | `string` | `Token has expired` |

{% sample lang="js" -%}

### POST ###
#### Body ####
| Name | Type | Required | Sample |
| -- | -- | -- | -- |
| `username` | `string` | `true` | `praj.basnet@gmail.com` |
| `password` | `string` | `true` | `steps` |

#### Response ####
| Name | Type | Sample |
| -- | -- | -- | -- |
| `key` | `string` | `6a80f3bdb886f15225e99d1cee2c0bce4a6d60d9` |


{% endmethod %}

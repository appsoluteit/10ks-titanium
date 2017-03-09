{% method -%}
## Login {#login}

Call this to login to the application and get an authorization token. The token is required for all subsequent calls to the API.
``` 
http://10000steps.org.au/api/auth/login/ 
```

{% sample lang="js" -%}

### POST ###
#### Params ####
| Name | Type | Required | Sample |
| -- | -- | -- | -- |
| `username` | `string` | `true` | `praj.basnet@gmail.com` |
| `password` | `string` | `true` | `steps` |

#### Returns ####
| Name | Type | Sample |
| -- | -- | -- | -- |
| `key` | `string` | `6a80f3bdb886f15225e99d1cee2c0bce4a6d60d9` |

{% endmethod %}
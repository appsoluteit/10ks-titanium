{% method -%}
## Register {#register}

Call this to register a user to the application.
``` 
http://10000steps.org.au/api/auth/registration/ 
```

### Status ###
<span style="color: red;"></span>

{% sample lang="js" -%}

### POST ###
#### Params ####
| Name | Type | Required | Sample |
| -- | -- | -- | -- |
| `username` | `string` | `true` | `myUsername` |
| `email` | `string` | `true` | `myUsername@domain.com` |
| `password1` | `string` | `true` | `steps1001` |
| `password2` | `string` | `true` | `steps1001` |

#### Returns ####
| Name | Type | Sample |
| -- | -- | -- |
|    | `boolean` | `true` |

{% endmethod %}
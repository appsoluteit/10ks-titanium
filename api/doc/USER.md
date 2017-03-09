{% method -%}
## User {#user}

Call this to get user information. We call this mainly to get the user URL which is required for some other API calls *(should it be?)*
``` 
http://10000steps.org.au/api/auth/user/
```

### Status ###
<span style="color: red;">405 Not Allowed (06/02/2017)</span>

{% sample lang="js" -%}

### GET ###
#### Headers ####
| Name | Type | Required | Sample |
| -- | -- | -- | -- |
| `Authorization` | `string` | `true` | `Token 6a80f3bdb886f15225e99d1cee2c0bce4a6d60d9` |

#### Returns ####
| Name | Type | Sample | Description |
| --   | --   | --     | --          | 
| `url` | `string` | `http://10000steps.org.au/api/users/9999` | A URL that identifies the user |

{% endmethod %}
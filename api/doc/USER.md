{% method -%}
## User {#user}

Call this to get user information. We call this mainly to get the user URL which is required for some other API calls
```
https://www.10000steps.org.au/api/auth/user/
```

{% sample lang="js" -%}

### GET ###
#### Headers ####
| Name | Type | Required | Sample |
| -- | -- | -- | -- |
| `Authorization` | `string` | `true` | `Token 6a80f3bdb886f15225e99d1cee2c0bce4a6d60d9` |

#### Returns {Object} ####
| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `url` | `string` | `https://www.10000steps.org.au/api/users/334098/` | A URL that identifies the user |
| `username` | `string` | `walker334098` | |
| `email` | `string` | `admin@jasonsultana.com` | The user's email |
| `groups` | `array` | `[]` | An array of joined groups? |
| `walker` | `object` | See below | Usage data |

##### Walker Object #####
| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `gender` | `integer` | `1` | An emum that represents the gender. 1 = M, 2 = F? |
| `total_steps` | `integer` | `277790` | The sum of the user's logged steps to date |
| `average_daily_steps` | `integer` | `5558` | An integer average of the user's daily steps |

{% endmethod %}

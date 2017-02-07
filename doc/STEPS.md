{% method -%}
## Steps {#login}

Call this to get a list of logged steps or to add a new step record.
``` 
http://steps10000.webfactional.com/api/steps/
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
| `count` | `int` | `91` | The number of step records for this user |
| `next`  | `string` | `http://steps10000.webfactional.com/api/steps/?page=2` | A URL to the next page of steps for this user |
| `previous` | `string` | `http://steps10000.webfactional.com/api/steps/?page=1` | A URL to the previous page |
| `results` | `object[]` | See POST params | A list of step records for this user |

### POST ###
#### Parameters ####
| Name | Type | Required | Sample | Description |
| --   | --   | --       | --     |             |
| `user` | `string` | `true` | `http://steps10000.webfactional.com.au/api/user/1111` | `A URL to a user account` See [User](USER.md) |
| `steps_date` | `string` | `???` | `2016-10-12` | `A YYYY-MM-DD date` |
| `steps_total` | `int` | `???` | `10000` | `A number indicating the total # of steps (including other exercise) for the day` |
| `steps_walked` | `int` | `???` | `6000` | `A number indicating the # of steps walked` |
| `moderate` | `int` | `???` | `3000` | `A number indicating the equivalent # of steps taken through moderate exercise` |
| `vigorous` | `int` | `???` | `1000` | `A number indicating the equivalent # of steps taken through vigorous exercise` |
| `activity_part` | `int` | `???` | `???` | `??? I don't know what this means` |

{% endmethod %}
{% method -%}
## Steps {#login}

Call this to get a list of logged steps or to add a new step record.
```
https://www.10000steps.org.au/api/steps/
```

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
| `next`  | `string` | `http://10000steps.org.au/api/steps/?page=2` | A URL to the next page of steps for this user |
| `previous` | `string` | `http://10000steps.org.au/api/steps/?page=1` | A URL to the previous page |
| `results` | `object[]` | See POST params | A list of step records for this user |

### POST ###
#### Parameters ####
| Name | Type | Required | Sample | Description |
| --   | --   | --       | --     |             |
| `user` | `string` | `false` | `http://10000steps.org.au/api/user/1111` | `A URL to a user account` See [User](USER.md) |
| `steps_date` | `string` | `true` | `2016-10-12` | `A YYYY-MM-DD date` |
| `steps_total` | `int` | `false` | `10000` | `A number indicating the total # of steps (including other exercise) for the day` |
| `steps_walked` | `int` | `false` | `6000` | `A number indicating the # of steps walked` |
| `moderate` | `int` | `false` | `2` | `A number indicating the equivalent # of steps taken through moderate exercise` |
| `vigorous` | `int` | `false` | `1` | `A number indicating the equivalent # of steps taken through vigorous exercise` |
| `activity_part` | `int` | `false` | `500` | `Indicates the equivalent # of steps through moderate and vigorous exercise. Equal to moderate x 100 plus vigorous x 200` |

{% endmethod %}

{% method -%}
## Steps {#login}

Call this to get statistics about logged steps for the logged in user.
```
https://www.10000steps.org.au/api/stats/
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
| `max_month` | `object` | See below | Statistics about the highest recorded month |
| `max_day`  | `object` | See below | Statistics about the highest recorded day |
| `average_steps` | `int` | `9999` | Average daily steps |

##### Max Month #####
| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `total` | `int` | `32767` | The total of steps recorded in that month |
| `month` | `string` | `2016-10-01` | The timestamp for the month with the highest logged steps |

##### Max Day #####
| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `user` | `string` | `https://www.10000steps.org.au/api/users/346623/` | The user URL |
| `steps_total` | `int` | `65535` | The total steps logged for the highest day |
| `steps_walked` | `int` | `9999` | The number of steps walked for the highest day |
| `steps_date` | `string` | `2016-10-12` | The date of the highest recorded steps |
| `activity_part` | `int` | 256 | No idea. What does this mean? |
| `moderate` | `int` | 128 | The number of minutes of moderate exercise performed on the day |
| `vigorous` | `int` | 64 | The number of minutes of vigorous exercise performed on the day |

{% endmethod %}

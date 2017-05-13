{% method -%}
## Steps {#login}

Call this to get available challenges for the logged in user.
```
https://www.10000steps.org.au/api/challenges/
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
| `count` | `int` | `91` | The number of challenges available for this user |
| `next`  | `string` | `http://10000steps.org.au/api/steps/?page=2` | A URL to the next page of challenges for this user |
| `previous` | `string` | `http://10000steps.org.au/api/steps/?page=1` | A URL to the previous page |
| `results` | `object[]` |  | A list of challenges records for this user (WHAT DO THEY LOOK LIKE??) |

{% endmethod %}

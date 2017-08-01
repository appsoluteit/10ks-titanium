{% method -%}
## Goals {#goals}
Call this to get or set user goals.

{% sample lang="js" -%}

### GET/POST ###
#### Headers ####
| Name | Type | Required | Sample |
| -- | -- | -- | -- |
| `Authorization` | `string` | `true` | `Token 6a80f3bdb886f15225e99d1cee2c0bce4a6d60d9` |

#### Body ####
| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `goal` | `integer` | `10000` | The goal steps for the user identified by the access token |

{% endmethod %}

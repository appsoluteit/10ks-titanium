{% method -%}

## Tournament Timeouts {#tournament_timeouts}

A Time Out Tournament runs for a number of weeks (which you determine)
and the goal is to accumulate as many steps as possible during this time
period.

```
https://www.10000steps.org.au/api/tournament_timeouts/
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
| `count` | `int` | `91` | The number of timeouts available for this user |
| `next`  | `string` | `http://10000steps.org.au/api/tournament_tmeouts/?page=2` | A URL to the next page of challenges for this user |
| `previous` | `string` | `http://10000steps.org.au/api/tournament_timeouts/?page=1` | A URL to the previous page |
| `results` | `Timeout[]` |  | A list of race records for this user |

##### Timeout #####

A Timeout is the top level object returned by tournament timeouts. It is simply a container for a Team object, an array of steps and the date the tournament started.

| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `team` | `Team` | `N/A` | An object representing your team. |
| `steps` | `string[]` | `N/A` | An array of URLs to step instances that made up this race so far for your team? Not sure |
| `date_started` | `string` | `` | The date the tournament was accepted by the user? |

##### Team #####

A team object simply contains an instance of Tournament.

##### Tournament #####

This actually contains the useful information. Its schema is:

| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `weeks` | `integer` | `3` | How many weeks the tournament runs for |
| `date_started` | `string` | `N/A` | The date the tournament was created |

{% endmethod -%}

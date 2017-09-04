{% method -%}
## Challenges {#challenges}

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

#### Response Body ####
| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `count` | `int` | `91` | The number of challenges available for this user |
| `next`  | `string` | `http://10000steps.org.au/api/steps/?page=2` | A URL to the next page of challenges for this user |
| `previous` | `string` | `http://10000steps.org.au/api/steps/?page=1` | A URL to the previous page |
| `results` | `Challenge[]` |  | A list of challenges |

##### Challenge #####

The Challenge is the top level object definition for challenges, the schema of which runs two levels deep. Challenges may be joined by multiple users, though it this is only doable via the website at this stage. Challenge information relative to a specific user is provided by https://www.10000steps.org.au/api/challenge_participant/.

| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `description` | `string` | N/A | The challenge description. |
| `start_date` | `string` | `2017-06-01` | The date on which the challenge became available. |
| `end_date` | `string` | `2017-06-31` | The date on which the challenge became inactive. |
| `is_active` | `bool` | `true` | Whether or not the challenge is active. |
| `challenge_tasks` | `ChallengeTask[]` | `see ChallengeTask below` | A Challenge object representing an option for the Challenge. |

##### ChallengeTask #####

Challenges can have several options to join, with varying levels of difficulty. These are exposed via ChallengeTask objects.

| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `name` | `string` | `Some Option` | The name of the option. This will typically differ from the name of the challenge. |
| `description` | `string` | `More information about the option.` | More details about the option. |
| `steps_goal` | `int` | `99` | The target for this option. |

{% endmethod %}

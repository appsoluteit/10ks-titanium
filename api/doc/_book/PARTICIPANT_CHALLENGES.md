{% method -%}
## Participant Challenges {#participant_challenges}

Call this to get joined challenges for the logged in user.
```
https://www.10000steps.org.au/api/challenges_participant/
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
| `next`  | `string` | `http://10000steps.org.au/api/challenges_participant/?page=2` | A URL to the next page of challenges for this user |
| `previous` | `string` | `http://10000steps.org.au/api/challenges_participant/?page=1` | A URL to the previous page |
| `results` | `Challenge[]` |  | A list of challenges |

##### Challenge #####

The Challenge is the top level object definition for challenges, the schema of which runs three levels deep. Challenges may be joined by multiple users, though it this is only doable via the website at this stage.

| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `steps_goal` | `int` | `10000` | The steps goal for the option joined by the user. |
| `steps_total` | `int` | `5000` | The number of steps completed so far. |
| `start_date` | `string` | `2017-06-01` | The date on which the challenge became available. |
| `is_active` | `bool` | `true` | Whether or not the challenge is active. |
| `percentage_complete` | `decimal` | `23.8` | The percentage completed so far. |
| `task` | `ChallengeTask` | `see ChallengeTask below` | A Challenge object representing an option for the Challenge. |

##### ChallengeTask #####

Challenges can have several options to join, with varying levels of difficulty. These are exposed via ChallengeTask objects.

| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `name` | `string` | `Some Option` | The name of the option. This will typically differ from the name of the challenge. |
| `description` | `string` | `More information about the option.` | More details about the option. |
| `steps_goal` | `int` | `99` | The target for this option. |
| `challenge` | `UserChallenge` | N/A | See the definition below. |

#### UserChallenge ####

The UserChallenge exposes challenge information specific to the user.

| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `description` | `string` | `More information about the challenge.` | More details about the challenge. |
| `steps_goal` | `int` | `99` | The target for this option. |
| `start_date` | `string` | `2017-06-01` | The date on which the challenge became available. |
| `end_date` | `string` | `2017-06-01` | The date on which the challenge became inactive. |
| `is_active` | `bool` | `true` | Whether or not the challenge is active. |

{% endmethod %}

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
| `results` | `ChallengeContainer[]` |  | A list of challenges records for this user |

##### ChallengeContainer #####

The ChallengeContainer is the top level object definition for challenges, the schema of which runs three levels deep.

| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `start_date` | `string` | `2017-06-01` | The start date of the challenge |
| `steps_goal` | `int` | `9999` | The goal (in steps) for this challenge |
| `steps_total` | `int` | `99` | The total number of steps so far |
| `is_active` | `bool` | `true` | Whether or not the challenge is active (What's the difference between active or inactive??) |
| `percentage_complete` | `int` | `10` | Basically steps_total / steps_goal. This should be calculable server-side |
| `task` | `Task` | `see Task below` | A Task object |

##### Task #####

A Task contains a little more information about the challenge. A challenge can theoretically contain a number of 'tasks'
(which could be variations of the challenge for different fitness levels, etc) but since you can only join one task per challenge
(or so it seems), I'm not sure why the nesting is needed.

| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `name` | `string` | `Some Challenge` | The name of the challenge |
| `description` | `string` | `More information about the challenge.` | More details about the challenge. It appears as though HTML formatting is supported |
| `steps_goal` | `int` | `99` | Not sure how this differs from `steps_goal` in ChallengeContainer |
| `challenge` | `Challenge` | `See Challenge below` | A Challenge object. |

##### Challenge #####
| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `description` | `string` | `My top-level challenge` | This is the description of the top-level challenge. Even though it is a child of a Task, the top-level description goes here |
| `start_date` | `string` | `2017-07-01` | The start date of the challenge |
| `end_date` | `string` | `2017-07-17` | The end date of the challenge |
| `is_active` | `bool` | `false` | Whats the difference between this and what's in ChallengeContainer? |

{% endmethod %}

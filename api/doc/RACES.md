{% method -%}

## Tournament Races {#tournament_races}

Race Tournaments are distance based journeys where the goal is to walk a
virtual route from one location to another. Progress cards become available
once the teams reach the checkpoints along the journey. In Race
Tournaments, teams will finish the journey at different times depending on
how active the members are and the number of members that are in the
teams. The estimated length of these Tournaments available online and
below and are based on 10 people in each team walking 10,000 steps per
day.

```
https://www.10000steps.org.au/api/tournament_races/
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
| `count` | `int` | `91` | The number of races available for this user |
| `next`  | `string` | `http://10000steps.org.au/api/tournament_races/?page=2` | A URL to the next page of challenges for this user |
| `previous` | `string` | `http://10000steps.org.au/api/tournament_races/?page=1` | A URL to the previous page |
| `results` | `Race[]` |  | A list of race records for this user |

##### Race #####

A Race is the top level object returned by tournament races. It is simply a container for a Team object an array of steps.

| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `team` | `Team` | `N/A` | An object representing your team. |
| `steps` | `string[]` | `N/A` | An array of URLs to step instances that made up this race so far for your team? Not sure |

##### Team #####

A team object simply contains an instance of Tournament.

##### Tournament #####

A tournament object contains a single child, also called tournament, referred to as TournamentChild in this document.

##### TournamentChild #####

This actually contains the useful information. Its schema is:

| Name | Type | Sample | Description |
| --   | --   | --     | --          |
| `description` | `string` | `N/A` | An HTML formatted description of the tournament. |
| `default_time` | `integer` | `N/A` | Not sure what this is |
| `total_steps` | `integer` | `N/A` | The total number of steps walked so far? |
| `distance_meters` | `integer` | `N/A` | The total distance of the tournament in meters |

{% endmethod -%}

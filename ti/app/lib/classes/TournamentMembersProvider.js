function TournamentMembersProvider() { 
    this.data = [];
}

function sort(a, b) {
    if(a.lastName[0] < b.lastName[0]) {
        return -1;
    }
    else if(a.lastName[0] > b.lastName[0]) {
        return 1;
    }
    else {
        return 0;
    }
}

TournamentMembersProvider.prototype.fetchFake = function() {
    // https://www.json-generator.com/
    var data = JSON.parse(`[
        {
          "firstName": "Kirsten",
          "lastName": "Pace",
          "steps": 10823
        },
        {
          "firstName": "Jessica",
          "lastName": "Rocha",
          "steps": 43955
        },
        {
          "firstName": "Leon",
          "lastName": "Weber",
          "steps": 76501
        },
        {
          "firstName": "Ayala",
          "lastName": "Mcclain",
          "steps": 9954
        },
        {
          "firstName": "Potts",
          "lastName": "Castaneda",
          "steps": 29695
        },
        {
          "firstName": "Lorene",
          "lastName": "Walton",
          "steps": 22719
        },
        {
          "firstName": "Rosario",
          "lastName": "Witt",
          "steps": 92883
        },
        {
          "firstName": "Wright",
          "lastName": "Gross",
          "steps": 27720
        },
        {
          "firstName": "Lorna",
          "lastName": "Mcmillan",
          "steps": 32480
        },
        {
          "firstName": "Reese",
          "lastName": "Russell",
          "steps": 82680
        },
        {
          "firstName": "Rosemary",
          "lastName": "Williams",
          "steps": 6287
        },
        {
          "firstName": "Camacho",
          "lastName": "Alvarado",
          "steps": 60990
        },
        {
          "firstName": "Ochoa",
          "lastName": "Ford",
          "steps": 19278
        },
        {
          "firstName": "Faith",
          "lastName": "Fisher",
          "steps": 38731
        },
        {
          "firstName": "Naomi",
          "lastName": "Nash",
          "steps": 59517
        },
        {
          "firstName": "Ross",
          "lastName": "Perkins",
          "steps": 73283
        },
        {
          "firstName": "David",
          "lastName": "Mccall",
          "steps": 70093
        },
        {
          "firstName": "Hines",
          "lastName": "Stuart",
          "steps": 83728
        },
        {
          "firstName": "White",
          "lastName": "Graves",
          "steps": 42524
        },
        {
          "firstName": "Kristy",
          "lastName": "Wilcox",
          "steps": 90583
        },
        {
          "firstName": "Deanna",
          "lastName": "Lowery",
          "steps": 46272
        },
        {
          "firstName": "Collins",
          "lastName": "Cobb",
          "steps": 7015
        },
        {
          "firstName": "Ashley",
          "lastName": "Velazquez",
          "steps": 37297
        },
        {
          "firstName": "Brandi",
          "lastName": "Cotton",
          "steps": 54872
        },
        {
          "firstName": "Blair",
          "lastName": "Browning",
          "steps": 85911
        },
        {
          "firstName": "Amie",
          "lastName": "Cruz",
          "steps": 49052
        },
        {
          "firstName": "Janelle",
          "lastName": "Dawson",
          "steps": 81590
        },
        {
          "firstName": "Conley",
          "lastName": "Erickson",
          "steps": 84141
        },
        {
          "firstName": "Frankie",
          "lastName": "Hoffman",
          "steps": 91571
        },
        {
          "firstName": "Reeves",
          "lastName": "Lamb",
          "steps": 53906
        },
        {
          "firstName": "Patty",
          "lastName": "Hester",
          "steps": 33997
        },
        {
          "firstName": "Velma",
          "lastName": "Slater",
          "steps": 94966
        },
        {
          "firstName": "まこと",
          "lastName": "いとう",
          "steps": 9999
        }
      ]`);

      data.sort(sort);
      return data;
};

TournamentMembersProvider.prototype.fetch = function(tournament) {
    var members = [];
    tournament.teams.forEach(function(e) {
        // Only show members belonging to the logged in user's team.
        if(e.is_users_team) {
            e.team_members.forEach(function(member) {
                members.push(member);
            });
        }
    });

    this.data = members.map(function(member) {
        return {
            firstName: member.first_name.length ? member.first_name : "Unknown",
            lastName: member.last_name.length ? member.last_name : "Unknown",
            steps: member.total_steps
        };
    });
    this.data.sort(sort);   
    return this.data;
}

module.exports = TournamentMembersProvider;
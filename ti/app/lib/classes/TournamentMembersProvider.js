function TournamentMembersProvider() { 
    // Initialise with dummy data until the real endpoint is implemented
    this.data = [{
        firstName: 'John',
        lastName: 'Doe',
        steps: 1234
    }, {
        firstName: 'Lisa',
        lastName: 'Simpson',
        steps: 3456,
    }, {
        firstName: 'Bugs',
        lastName: 'Bunny',
        steps: 6789
    }];
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

TournamentMembersProvider.prototype.fetch = function(tournament) {
    // Note: this will show ALL members for ALL teams. We may want to filter
    // to the logged in user's team OR show the team name.

    var members = [];
    tournament.teams.forEach(function(e) {
        e.team_members.forEach(function(member) {
            members.push(member);
        });
    });

    console.log('discovered members: ' + JSON.stringify(members));

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
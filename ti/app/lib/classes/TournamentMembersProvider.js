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
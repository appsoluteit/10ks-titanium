function TournamentLeaderboardProvider() { 
    // Initialise with dummy data until the real endpoint is implemented
    this.data = [{
        rank: 2,
        name: 'Illidan\'s immortals',
        numMembers: 9,
        totalSteps: 9999,
        status: 90
    }, {
        rank: 1,
        name: 'The Ginyu Force',
        numMembers: 7,
        totalSteps: 12345,
        status: 100
    }, {
        rank: 3,
        name: 'Perpetual Procrastinators',
        numMembers: 2,
        totalSteps: 5,
        status: 1
    }];
}

function sort(a, b) {
    if(a.rank < b.rank) {
        return -1;
    }
    else if(a.rank > b.rank) {
        return 1;
    }
    else {
        return 0;
    }
}

TournamentLeaderboardProvider.prototype.fetch = function(tournament) {
    this.data = tournament.teams.map(function(team) {
        return {
            rank: team.ranking,
            name: team.name,
            numMembers: team.get_member_count,
            totalSteps: team.total_steps,
            status: Math.round(team.total_steps / tournament.tournamentTotalSteps * 100)
        };
    });

    this.data.sort(sort);
    return this.data;
}

module.exports = TournamentLeaderboardProvider;
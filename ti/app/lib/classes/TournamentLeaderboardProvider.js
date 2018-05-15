var q = require('q');

function TournamentLeaderboardProvider() { 
    // Initialise with dummy data until the real endpoint is implemented
    this.data = [{
        rank: 2,
        name: 'Illidan\'s immortals',
        totalSteps: 9999,
        status: 90
    }, {
        rank: 1,
        name: 'The Ginyu Force',
        totalSteps: 12345,
        status: 100
    }, {
        rank: 3,
        name: 'Perpetual Procrastinators',
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

TournamentLeaderboardProvider.prototype.fetch = function(tournamentGuid) {
    var deferer = q.defer();
    var me = this;

    setTimeout(function() {
        me.data.sort(sort);
        deferer.resolve(me.data);
    }, 3000);

    return deferer.promise;
}

module.exports = TournamentLeaderboardProvider;
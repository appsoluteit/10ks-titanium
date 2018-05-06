var q = require('q');

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

TournamentMembersProvider.prototype.fetch = function(tournamentGuid) {
    var deferer = q.defer();
    var me = this;

    setTimeout(function() {
        me.data.sort(sort);
        deferer.resolve(me.data);
    }, 1000);

    return deferer.promise;
}

module.exports = TournamentMembersProvider;
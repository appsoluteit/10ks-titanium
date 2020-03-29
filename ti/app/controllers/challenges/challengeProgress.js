var ChallengeData = $.args.challengeData;
var DateTimeHelper = require('helpers/DateTimeHelper');
var FormatHelper = require('helpers/FormatHelper');

function btnBack_click() {
    $.challengeProgress.close();
}

function populateTable() {
    Ti.API.info('challengeProgress populating table');

    var challenge = ChallengeData.lastJoinedChallenge.challenge;
    var task = ChallengeData.lastJoinedChallenge.task;

    //Ti.API.info('challenge', challenge);
    //Ti.API.info('task', task);

    var today = DateTimeHelper.localise(new Date());
    var startDate = DateTimeHelper.localise(new Date(task.challenge.start_date));
    var endDate = DateTimeHelper.localise(new Date(task.challenge.end_date));

    Ti.API.info('Populating goal steps');
    $.challengeProgressView.lblGoalSteps.text = 
        FormatHelper.formatNumber(challenge.steps_goal);

    Ti.API.info('Populating progress steps');
    $.challengeProgressView.lblProgressSteps.text = 
        FormatHelper.formatNumber(challenge.steps_total);

    Ti.API.info('Populating start date');
    $.challengeProgressView.lblStartDate.text = 
        DateTimeHelper.getDateLabel(startDate, true);

    Ti.API.info('Populating end date');
    $.challengeProgressView.lblEndDate.text = 
        DateTimeHelper.getDateLabel(endDate, true);

    // Calculate day diff between today and task.end_date.
    
    var timeLeft = DateTimeHelper.getTimeBetween(endDate, today, false); // don't show hours
    $.challengeProgressView.lblTimeLeft.text = timeLeft;

    // Remaining steps
    var remainingSteps = challenge.steps_goal - challenge.steps_total;
    Ti.API.info('Remaining steps: ' + remainingSteps);

    $.challengeProgressView.lblRemainingSteps.text = 
        FormatHelper.formatNumber(remainingSteps);

    // Required steps / day
    var remainingDays = DateTimeHelper.getDaysBetween(endDate, today);
    Ti.API.info('Remaining days: ' + remainingDays);

    var stepsPerDay = remainingDays > 0 ?
        Math.round(remainingSteps / remainingDays) :
        0;

    Ti.API.info('Steps per day: ' + stepsPerDay);
    $.challengeProgressView.lblRequiredDailySteps.text = 
        FormatHelper.formatNumber(stepsPerDay);

    // % complete
    var percentComplete = challenge.percentage_complete;
    $.challengeProgressView.lblPercentComplete.text = Math.round(percentComplete * 100) + '%';

    $.challengeProgressView.vbar1.init(
        challenge.steps_total, 
        challenge.steps_goal
    );
}

function promptForNewChallenge() {
    // If there is an available challenge and the last joined challenge 
    // task id does not exist within the available challenge tasks 
    // (i.e - you haven't already joined the challenge), prompt the user
    // to join it.
    
    var shouldPromptForNewChallenge = ChallengeData.availableChallenge &&
        ChallengeData.availableChallenge.challenge_tasks.filter(function(task) {
            return task.id == ChallengeData.lastJoinedChallenge.task.id;
        }).length === 0;
        
    if (shouldPromptForNewChallenge) {
        var confirmDialog = Ti.UI.createAlertDialog({
            cancel: 0,
            buttonNames: ['No thanks', 'Sure!'],
            message: 'Do you want to view the new challenge?',
            title: 'A new challenge is available!'
        });
    
        confirmDialog.addEventListener('click', function(e) {
            if(e.index !== e.source.cancel) {
                var win = Alloy.createController('challenges/challenges', {
                    challengeData: ChallengeData
                }).getView();
    
                win.open();
            }
        });
    
        confirmDialog.show();
    }
}

function window_open() {
    $.challengeProgressView.title.text = ChallengeData.lastJoinedChallenge.name;

    Alloy.Globals.tracker.addScreenView('Challenge Progress');

    $.challengeProgressView.btnChallengeDetails.addEventListener('click', function() {
        var win = Alloy.createController('challenges/challengeDetails', {
            challenge: ChallengeData.lastJoinedChallenge.task
        })
        .getView();

        win.open();
    });

    populateTable();

    setTimeout(function() {
        promptForNewChallenge();
    }, 1000);
}
var challenge = $.args.challenge;
var ui = require('xp.ui');

function window_open() {
    $.window.title = challenge.name;

    // Set the content
    var taskDescription = ui.createLabel({
        top: "10dp",
        left: "10dp",
        right: "10dp",
        html: challenge.description + "<br/>",
        color: 'black'
    });
    $.challengeDetailsView.descriptionContainer.add(taskDescription);
}

function btnBack_click() {
    $.challengeDetails.close();
}
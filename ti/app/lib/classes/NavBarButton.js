/**
 * @file NarBarButton
 * @description Generates a NavBarButton (left or right) for iOS
 * https://jira.appcelerator.org/browse/TIMOB-15381
 */

function createLeftNavButton(options) {
	//We need to manually generate the navigation buttons for custom appearances
	var wrapper = Ti.UI.createView({
	    width:Ti.UI.SIZE,
	    height:30 //Fits nicely in portrait and landscape
	});
	 
	var backBtn = Ti.UI.createButton({
	    image: "/common/chevrons/left-16-w.png",
	    title: options.text,
	    style:Ti.UI.iOS.SystemButtonStyle.PLAIN //For good behavior on iOS6
	});
	backBtn.addEventListener('click', options.onClick);
	wrapper.add(backBtn);
	
	return wrapper;
}

function createRightNavButton(options) {
	var rightWrapper = Ti.UI.createView({
		width: Ti.UI.SIZE,
		height: 30
	});
	
	var rightBtn = null;
	
	if(options.image) {
		rightBtn = Ti.UI.createButton({
			image: options.image,
			style: Ti.UI.iOS.SystemButtonStyle.PLAIN,
			tintColor: '#52B3FA',
			color: '#52B3FA'
		});
	}
	else {
		rightBtn = Ti.UI.createButton({
			title: options.text,
			color: "#52B3FA",
			style: Ti.UI.iOS.SystemButtonStyle.PLAIN
		});
	}
	
	rightBtn.addEventListener('click', options.onClick);
	rightWrapper.add(rightBtn);
		
	return rightWrapper;
}

module.exports.createLeftNavButton = createLeftNavButton;
module.exports.createRightNavButton = createRightNavButton;
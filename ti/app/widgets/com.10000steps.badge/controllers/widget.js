var args = $.args;

(function() {
	console.log("Loading badge. Args:", args);
	
	//On Android, load the image from the widget's local directory. Otherwise the image may not show.
	//On iOS, load it from the project root. Otherwise the image may be too big.
	
	if(Ti.Platform.osname === "android") {
		$.icon.image = args.image;
		//$.icon.image = WPATH('steps.png');		
		$.badge.visible = false;
	}
	else {
		if(args.image) {
			$.icon.image = args.image;		
		}
		
		//Set the badge size to be based on the calculated image size (to be flexible between iPhone and iPad)
		var iconImage = Ti.UI.createImageView({
			image: $.icon.image,
			height: 'auto',
			width: 'auto'
		}).toBlob();
		var iconWidth = iconImage.width;
		iconImage = null;
		
		console.log("Icon width: " + iconWidth);	
		
		var badgeSize = iconWidth / 10;
		
		console.log("Badge size: " + badgeSize);
		$.badge.setHeight(badgeSize);
		$.badge.setWidth(badgeSize);
		$.badge.setBorderRadius(badgeSize / 2);	
		
		//Set the counter font to be 1/5 of the icon width on iOS
		$.counter.font = {
			fontSize: 'small' // badgeSize / 5
		};			
	}
	
	if(args.top) {
		$.container.top = args.top;
	}
	
	//Expose the icon button for click events
	$.addEventListener = function(event, callback) {
		$.icon.addEventListener(event, callback);
	};
	
	$.setBadge = function(counter) {
		if(Ti.Platform.osname === "android") {
			if(counter > 0) {
				//$.icon.image = WPATH('steps_' + counter + '.png');
				$.icon.image = args.image;
			}
			else {
				//$.icon.image = WPATH('steps.png');	
				$.icon.image = args.image;				
			}
		}
		else {
			if(counter > 0) {
				$.badge.visible = true;	
			}
			else {
				$.badge.visible = false;
			}
			
			//$.badge.visible = true; // debug
			$.counter.text = counter;	
		}
	};
})();

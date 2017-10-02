var args = $.args;

(function() {
	console.log("Loading badge. Args:", args);
	
	//On Android, load the image from the widget's local directory. Otherwise the image may not show.
	//On iOS, load it from the project root. Otherwise the image may be too big.
	
	if(Ti.Platform.osname === "android") {
		$.icon.image = WPATH('image.png');		
	}
	else {
		if(args.image) {
			$.icon.image = args.image;		
		}		
	}
	
	if(args.badge) {
		$.counter.text = args.badge;		
	}
	
	if(args.top) {
		$.container.top = args.top;
	}
	
	//Expose the icon button for click events
	$.addEventListener = function(event, callback) {
		$.icon.addEventListener(event, callback);
	};
	
	$.setBadge = function(counter) {
		if(counter > 0) {
			$.badge.visible = true;	
		}
		else {
			$.badge.visible = false;
		}
		
		$.counter.text = counter;
	};
})();

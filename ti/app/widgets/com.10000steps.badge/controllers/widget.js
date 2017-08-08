var args = $.args;

(function() {
	console.log("Loading badge. Args:", args);
	
	if(args.image) {
		$.icon.image = args.image;		
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
		$.counter.text = counter;
	};
})();

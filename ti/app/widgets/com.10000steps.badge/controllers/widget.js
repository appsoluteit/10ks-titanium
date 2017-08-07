var args = $.args;

(function() {
	console.log("Loading badge. Image = ", args.image, "Counter = ", args.badge);
	
	if(args.image) {
		$.icon.image = args.image;		
	}
	
	if(args.badge) {
		$.counter.text = args.badge;		
	}
	
	//Expose the icon button for click events
	$.addEventListener = function(event, callback) {
		$.icon.addEventListener(event, callback);
	};
	
	$.setBadge = function(counter) {
		$.counter.text = counter;
	};
})();

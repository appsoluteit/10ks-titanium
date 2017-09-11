function smallestOf(options) {
	var smallest = undefined;
	
	for(var i = 0; i < options.length; i++) {
		if(options[i] < smallest || smallest === undefined) {
			smallest = options[i];
		}
	}
	
	return smallest;
}

function highestOf(options) {
	var highest = undefined;
	
	for(var i = 0; i < options.length; i++) {
		if(options[i] > highest || highest === undefined) {
			highest = options[i];
		}
	}
	
	return highest;
}

module.exports.smallestOf = smallestOf;
module.exports.highestOf = highestOf;
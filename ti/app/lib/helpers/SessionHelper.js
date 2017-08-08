function isTokenInvalid(response) {
	return response.detail === "Invalid token.";	
}

function showInvalidTokenToast(rootView) {
	Alloy.createWidget("com.mcongrove.toast", null, {
		text: "Session expired. Please log in again.",
		duration: 2000,
		view: rootView,
		theme: "error"
	});
}

module.exports.isTokenInvalid = isTokenInvalid;
module.exports.showInvalidTokenToast = showInvalidTokenToast;
chrome.contextMenus.create({
	title: "Save Flickr Image", 
	contexts:["page", "selection", "link"], 
	documentUrlPatterns: ["https://www.flickr.com/photos/*","https://www.flickr.com/groups/*"],
	onclick: function(info, tab){
		console.log(info);
		console.log(tab);
		chrome.tabs.sendMessage(tab.id, {event:'saveFlickrImage'}, function(response) {
			console.log(response);
		});
	}
});
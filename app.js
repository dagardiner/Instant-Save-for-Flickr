var last_target = null;
document.addEventListener('mousedown', function(event){
  last_target = event.target;
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  try {
    //Try and get image source URL for timeline page or single-post page
    var filePath = "unknown";
    var fileName = "download";
    
    //Groups or Sets
    try {
		var imageDiv = last_target.parentNode.parentNode.parentNode;
		var style = imageDiv.currentStyle || window.getComputedStyle(imageDiv, false)
		filePath = style.backgroundImage.slice(4, -1).replace(/"/g, "");
		filePath = filePath.replace(/_.\.j/g, ".j").replace(".j", "_b.j");
		fileName = last_target.getAttribute("aria-label");
    }
	catch(err) { }
	
    //individual photos - from source, max image size
    if(!filePath || filePath.length == 0 || filePath == "unknown") {
		try {
			filePath = Object.values(JSON.parse(document.getElementsByClassName("modelExport")[0].innerHTML.split("modelExport:")[1].split("auth")[0].trim().slice(0, -1)).main["photo-models"][0].sizes).sort(function(a,b){return b.width-a.width;})[0].url;
		}
		catch(err) { }
    }
    
    //individual photos - from metadata
    if(!filePath || filePath.length == 0 || filePath == "unknown") {
		var metas = document.getElementsByTagName('meta');
		for (var i=0;i<metas.length;i++){
		  if (metas[i].getAttribute("property") == "og:image") {
			filePath = metas[i].getAttribute("content");
		  }
		}
	}
	
	//Filename for individual files
	if(!fileName || fileName.length == 0 || fileName == "download") {
		var metas = document.getElementsByTagName('meta');
		for (var i=0;i<metas.length;i++){
		  if (metas[i].getAttribute("name") == "title") {
			fileName = metas[i].getAttribute("content");
		  }
		}
	}

    if(filePath != "unknown") {
		fileName = fileName.replace(/\./g, " ")
		console.log("Downloading " + fileName + " from " + filePath);
      //Logic based on https://stackoverflow.com/questions/934012/get-image-data-in-javascript
      var page = this;
      var xhr = new XMLHttpRequest();
      xhr.open('get', filePath);
      xhr.timeout = 2000;
      xhr.responseType = 'blob';
      xhr.onload = function(){
		var anchor = document.createElement('a');
		var objectURL = URL.createObjectURL(xhr.response);
		anchor.setAttribute('href', objectURL);
		anchor.setAttribute('download', fileName);
		anchor.setAttribute('target', "_blank");
		anchor.click();
		setTimeout(function() {
			console.log(objectURL);
			window.URL.revokeObjectURL(objectURL);
		});
      };
      xhr.send();
    }
    else {
      console.log("Image URL not found.");
    }
  }
  catch(err) {
      console.log("Invalid image, cannot be saved...", err);
  }
});
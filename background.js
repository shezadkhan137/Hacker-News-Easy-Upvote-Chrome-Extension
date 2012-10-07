var link_store = {}


chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	
  	if (request.req_link_store === true){

  		sendResponse(link_store)

  	}

  	else if ("del" in request){
  		
  		delete link_store[request.del]
  		sendResponse({success:true})
  	
  	}
  	
  	else {
  		
  		link_store[request.a_lnk] = request.v_lnk
     	sendResponse({success: true});

  	}

  });
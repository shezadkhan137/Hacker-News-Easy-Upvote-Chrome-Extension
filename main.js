/*
Basic Outline --- 
	Check if the page is hacker news:
		if it is:
			take all article links and links to upvote page and store
			in a temp object.

			when the article is clicked on it gets added a cross page object in 
			background.

		if page is not hacker news:
			the url gets checked to see if has been clicked
			on (by checking against store in background.js)

			if it has, the icon gets added in bottom left of page, 
			and a function is boud to the click event.

*/

var include = /^http?:\/\/(www\.)?news.ycombinator\.com\//;

if (include.test(location.href)) {

	temp_link_store = {}
    
	links = $($("table table:nth-child(1)")[1]).children("tbody").children("tr:nth-child(3n-2)")

	for (var i = 0; i < links.length; i++){
		
		var upvote = $(links[i]).children("td:nth-child(2)")
		var article_link = $(links[i]).children("td:nth-child(3)")
		
		temp_link_store[article_link.children("a").attr("href")] = upvote.children("center").children("a").attr("href") 
		
		article_link.children("a").click(function(event){
			
			var a_lnk = $(this).attr("href")
			var v_lnk = temp_link_store[$(this).attr("href")]
			

			chrome.extension.sendMessage({a_lnk: a_lnk, v_lnk: v_lnk}, function(response) {
				console.log(response.success);
			});
		
		})
	}
}

else {
	
	chrome.extension.sendMessage({req_link_store:true}, function(response) {
		
		if (location.href in response){
			
			var vote_link = "http://news.ycombinator.com/" + response[location.href];
			var img_src = chrome.extension.getURL('yc-company.png')
			console.log(vote_link)

			
			$("body").prepend("<div id='hacker'> <a id='hacker_news_link' href='#'> <img src='"+img_src+"' </a> </div>")
		


			$("#hacker_news_link").click(function(event){
				event.preventDefault()
				$.get(vote_link, function(response){

					if (response.length != 0){
						location.href = "http://news.ycombinator.com/newslogin?whence=news"
					}

					else{

						chrome.extension.sendMessage({del:location.href}, function(response) {
							if (response.success){
								$("#hacker").remove()
							}
						});
					}

				})

			})
		}

	})

};

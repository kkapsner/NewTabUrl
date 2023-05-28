
async function startup(){
	"use strict";
	
	const optionsUrl = "options/index.html?full";
	let [{url, pageType}, {tabId}] = await Promise.all([
		browser.storage.local.get({url: optionsUrl, pageType: "URL"}),
		browser.tabs.query({active: true, currentWindow: true}),
	]);
	if (pageType === "HTML"){
		const {html, js} = await browser.storage.local.get({html: "", js: ""});
		if (html){
			document.open();
			document.write(html);
			document.close();
			if (js){
				window.setTimeout(function(){
					eval(js);
				}, 1);
			}
			return;
		}
		url = optionsUrl;
	}
	browser.tabs.update(
		tabId,
		{
			url,
			loadReplace: true
		}
	);
}
startup();
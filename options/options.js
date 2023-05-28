(async function(){
	"use strict";
	if (!document.location.search.startsWith("?full")){
		document.body.classList.add("inTabbedView");
	}
	document.querySelectorAll(".translatable").forEach(function(translatable){
		const message = translatable.dataset.message;
		if (message){
			translatable.textContent = browser.i18n.getMessage(message) || message;
		}
	});
	
	document.getElementById("newTabURL").textContent = browser.runtime.getURL("newTab.html");
	
	const settings = await browser.storage.local.get({url: "", pageType: "URL", html: "", js: ""});
	
	function updateSectionVisibility(type){
		document.querySelectorAll(".typeSection").forEach(function(typeSection){
			typeSection.style.display = typeSection.dataset.type === type? "": "none";
		});
	}
	
	const pageType = document.getElementById("pageType");
	pageType.addEventListener("change", function(){
		updateSectionVisibility(pageType.value);
		browser.storage.local.set({pageType: pageType.value});
	});
	pageType.value = settings.pageType;
	updateSectionVisibility(pageType.value);
	
	function link(id, storageName){
		
		const inputNode = document.getElementById(id);
		["input", "change", "keypress"].forEach(function(eventType){
			inputNode.addEventListener(eventType, updateStorage);
		});
		
		inputNode.value = settings[storageName];
		
		function updateStorage(){
			if (inputNode.value){
				const storageObject = {};
				storageObject[storageName] = inputNode.value;
				browser.storage.local.set(storageObject);
			}
			else {
				browser.storage.local.remove(storageName);
			}
		}
	}
	
	link("URL", "url");
	link("HTML", "html");
	link("JS", "js");
}());
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.todo == "showPageAction") {
        var _tabID = sender.tab.id;
        chrome.pageAction.show(_tabID);
    }
});
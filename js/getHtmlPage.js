function httpGetAsync(url, callback)
{
    var theUrl = url;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			var imgUrl = getImgFromSite(xmlHttp.responseText);
			var productTitle = getUrlProductFromNameOfSite(xmlHttp.responseText);
            var ReturnObj = {'imgUrl':imgUrl,'productTitle':productTitle}
            callback(ReturnObj);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function getImgFromSite(xmlHttp) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(xmlHttp,"text/html");

    var imgTagWrapper = doc.getElementById('imgTagWrapperId');
    if(imgTagWrapper){
        var imgTag = imgTagWrapper.children[0];
        var imgHiRes = imgTag.getAttribute('data-old-hires');
        console.log(imgHiRes);
        if(imgHiRes)
            return decodeIMG(imgHiRes.toString());
        else
            return decodeIMG(imgTag.src.toString())
    }    
    return '';

}

function getUrlProductFromNameOfSite(xmlHttp) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(xmlHttp,"text/html");

    var productTitle = doc.getElementById('productTitle').innerText;
    if(productTitle) {
        console.log(productTitle);
        var strTitle = productTitle.replace(/^\s+|\s+$/g,"");
        var toflowerCaseTitle = strTitle.toLowerCase();
        var urlProduct = toflowerCaseTitle.replace(/ /g, '-');
        return urlProduct;
    }
    return '';
}


function isBase64(imgURL){
    if(imgURL.match(/(data:image\/(jpeg|png|jpg|gif)\;base64)/g))
        return true;
    return false
}

function decodeIMG(imgUrl){
    // console.log(imgUrl);
    if(isBase64(imgUrl))
        return imgUrl;
    var imgNameFilter = /([^\/\\]+)$/g;
    var paths = imgUrl.split(imgNameFilter);
    var retImgURL = paths[0];
    var imgDynamicName = paths[1];
    var imgSplit = imgDynamicName.split(/(?:%7C)/g);
    retImgURL += imgSplit.find(function(item){
        if(item.match(/^((?!,).)*.(jpeg|png|jpg|gif)$/g)){
            return item;
        }
    })
    
    return retImgURL;
}

function OpenImgFromCurrentTab(){
    var imgTagWrapper = document.getElementById("imgTagWrapperId");
    console.log(imgTagWrapper.innerHTML);
    if(imgTagWrapper){
        var imgTag = imgTagWrapper.children[0];
        var imgHiRes = imgTagWrapper.getAttribute('data-old-hires');
        console.log(imgTag.src.toString());
        window.open(imgTag.src);
    }
}

function encodeURL(ulr){
}
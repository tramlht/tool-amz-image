var mockupURL = "http://dvbatdongsan.vn/tool-amz/images/background/black.jpg";

function csvJSON(csv){

    var lines=csv.split("\n");
  
    var result = [];
  
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
    
    //return result; //JavaScript object
    return JSON.parse(JSON.stringify(result)); //JSON
}


//mockup va design phai nam tren cung 1 thu muc tren o cung
function mergeImage(mockup, design, callback) {
    var canvas = document.getElementById('canvas');
    var imageObj1 = new Image();
    var imageObj2 = new Image();

    imageObj1.src = mockup;
    imageObj1.onload = function () {
        canvas.setAttribute('width',imageObj1.width);
        canvas.setAttribute('height',imageObj1.height);
        var ctx = canvas.getContext('2d');
        ctx.globalAlpha = 1.0;
        ctx.drawImage(imageObj1, 0, 0, imageObj1.width, imageObj1.height);
        imageObj2.src = design;
        imageObj2.onload = function () {
            ctx.globalAlpha = 1.0;
            ctx.drawImage(imageObj2, 0, 0, imageObj2.width, imageObj2.height, 0, 0, imageObj1.width, imageObj1.height );
            var img = canvas.toDataURL('image/jpeg');
            var imgresult = document.getElementById('id-result');
            imgresult.setAttribute('src', img);
            console.log(img);
            callback(imgresult);
        }
    };
}

/**
 * covert canvas to image
 * and save the image file
 */

var Canvas2Image = function () {

	// check if support sth.
	var $support = function () {
		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');

		return {
			canvas: !!ctx,
			imageData: !!ctx.getImageData,
			dataURL: !!canvas.toDataURL,
			btoa: !!window.btoa
		};
	}();

	var downloadMime = 'image/octet-stream';

	function scaleCanvas (canvas, width, height) {
		var w = canvas.width,
			h = canvas.height;
		if (width == undefined) {
			width = w;
		}
		if (height == undefined) {
			height = h;
		}

		var retCanvas = document.createElement('canvas');
		var retCtx = retCanvas.getContext('2d');
		retCanvas.width = width;
		retCanvas.height = height;
		retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
		return retCanvas;
	}

	function getDataURL (canvas, type, width, height) {
		canvas = scaleCanvas(canvas, width, height);
		return canvas.toDataURL(type);
	}

	function saveFile (strData) {
		document.location.href = strData;
	}

	function genImage(strData) {
		var img = document.createElement('img');
		img.src = strData;
		return img;
	}
	function fixType (type) {
		type = type.toLowerCase().replace(/jpg/i, 'jpeg');
		var r = type.match(/png|jpeg|bmp|gif/)[0];
		return 'image/' + r;
	}
	function encodeData (data) {
		if (!window.btoa) { throw 'btoa undefined' }
		var str = '';
		if (typeof data == 'string') {
			str = data;
		} else {
			for (var i = 0; i < data.length; i ++) {
				str += String.fromCharCode(data[i]);
			}
		}

		return btoa(str);
	}
	function getImageData (canvas) {
		var w = canvas.width,
			h = canvas.height;
		return canvas.getContext('2d').getImageData(0, 0, w, h);
	}
	function makeURI (strData, type) {
		return 'data:' + type + ';base64,' + strData;
	}


	/**
	 * create bitmap image
	 * 按照规则生成图片响应头和响应体
	 */
	var genBitmapImage = function (oData) {

		//
		// BITMAPFILEHEADER: http://msdn.microsoft.com/en-us/library/windows/desktop/dd183374(v=vs.85).aspx
		// BITMAPINFOHEADER: http://msdn.microsoft.com/en-us/library/dd183376.aspx
		//

		var biWidth  = oData.width;
		var biHeight	= oData.height;
		var biSizeImage = biWidth * biHeight * 3;
		var bfSize  = biSizeImage + 54; // total header size = 54 bytes

		//
		//  typedef struct tagBITMAPFILEHEADER {
		//  	WORD bfType;
		//  	DWORD bfSize;
		//  	WORD bfReserved1;
		//  	WORD bfReserved2;
		//  	DWORD bfOffBits;
		//  } BITMAPFILEHEADER;
		//
		var BITMAPFILEHEADER = [
			// WORD bfType -- The file type signature; must be "BM"
			0x42, 0x4D,
			// DWORD bfSize -- The size, in bytes, of the bitmap file
			bfSize & 0xff, bfSize >> 8 & 0xff, bfSize >> 16 & 0xff, bfSize >> 24 & 0xff,
			// WORD bfReserved1 -- Reserved; must be zero
			0, 0,
			// WORD bfReserved2 -- Reserved; must be zero
			0, 0,
			// DWORD bfOffBits -- The offset, in bytes, from the beginning of the BITMAPFILEHEADER structure to the bitmap bits.
			54, 0, 0, 0
		];

		//
		//  typedef struct tagBITMAPINFOHEADER {
		//  	DWORD biSize;
		//  	LONG  biWidth;
		//  	LONG  biHeight;
		//  	WORD  biPlanes;
		//  	WORD  biBitCount;
		//  	DWORD biCompression;
		//  	DWORD biSizeImage;
		//  	LONG  biXPelsPerMeter;
		//  	LONG  biYPelsPerMeter;
		//  	DWORD biClrUsed;
		//  	DWORD biClrImportant;
		//  } BITMAPINFOHEADER, *PBITMAPINFOHEADER;
		//
		var BITMAPINFOHEADER = [
			// DWORD biSize -- The number of bytes required by the structure
			40, 0, 0, 0,
			// LONG biWidth -- The width of the bitmap, in pixels
			biWidth & 0xff, biWidth >> 8 & 0xff, biWidth >> 16 & 0xff, biWidth >> 24 & 0xff,
			// LONG biHeight -- The height of the bitmap, in pixels
			biHeight & 0xff, biHeight >> 8  & 0xff, biHeight >> 16 & 0xff, biHeight >> 24 & 0xff,
			// WORD biPlanes -- The number of planes for the target device. This value must be set to 1
			1, 0,
			// WORD biBitCount -- The number of bits-per-pixel, 24 bits-per-pixel -- the bitmap
			// has a maximum of 2^24 colors (16777216, Truecolor)
			24, 0,
			// DWORD biCompression -- The type of compression, BI_RGB (code 0) -- uncompressed
			0, 0, 0, 0,
			// DWORD biSizeImage -- The size, in bytes, of the image. This may be set to zero for BI_RGB bitmaps
			biSizeImage & 0xff, biSizeImage >> 8 & 0xff, biSizeImage >> 16 & 0xff, biSizeImage >> 24 & 0xff,
			// LONG biXPelsPerMeter, unused
			0,0,0,0,
			// LONG biYPelsPerMeter, unused
			0,0,0,0,
			// DWORD biClrUsed, the number of color indexes of palette, unused
			0,0,0,0,
			// DWORD biClrImportant, unused
			0,0,0,0
		];

		var iPadding = (4 - ((biWidth * 3) % 4)) % 4;

		var aImgData = oData.data;

		var strPixelData = '';
		var biWidth4 = biWidth<<2;
		var y = biHeight;
		var fromCharCode = String.fromCharCode;

		do {
			var iOffsetY = biWidth4*(y-1);
			var strPixelRow = '';
			for (var x = 0; x < biWidth; x++) {
				var iOffsetX = x<<2;
				strPixelRow += fromCharCode(aImgData[iOffsetY+iOffsetX+2]) +
							   fromCharCode(aImgData[iOffsetY+iOffsetX+1]) +
							   fromCharCode(aImgData[iOffsetY+iOffsetX]);
			}

			for (var c = 0; c < iPadding; c++) {
				strPixelRow += String.fromCharCode(0);
			}

			strPixelData += strPixelRow;
		} while (--y);

		var strEncoded = encodeData(BITMAPFILEHEADER.concat(BITMAPINFOHEADER)) + encodeData(strPixelData);

		return strEncoded;
	};

	/**
	 * saveAsImage
	 * @param canvasElement
	 * @param {String} image type
	 * @param {Number} [optional] png width
	 * @param {Number} [optional] png height
	 */
	var saveAsImage = function (canvas, width, height, type) {
		if ($support.canvas && $support.dataURL) {
			if (typeof canvas == "string") { canvas = document.getElementById(canvas); }
			if (type == undefined) { type = 'png'; }
			type = fixType(type);
			if (/bmp/.test(type)) {
				var data = getImageData(scaleCanvas(canvas, width, height));
				var strData = genBitmapImage(data);
				saveFile(makeURI(strData, downloadMime));
			} else {
				var strData = getDataURL(canvas, type, width, height);
				saveFile(strData.replace(type, downloadMime));
			}
		}
	};

	var convertToImage = function (canvas, width, height, type) {
		if ($support.canvas && $support.dataURL) {
			if (typeof canvas == "string") { canvas = document.getElementById(canvas); }
			if (type == undefined) { type = 'png'; }
			type = fixType(type);

			if (/bmp/.test(type)) {
				var data = getImageData(scaleCanvas(canvas, width, height));
				var strData = genBitmapImage(data);
				return genImage(makeURI(strData, 'image/bmp'));
			} else {
				var strData = getDataURL(canvas, type, width, height);
				return genImage(strData);
			}
		}
	};



	return {
		saveAsImage: saveAsImage,
		saveAsPNG: function (canvas, width, height) {
			return saveAsImage(canvas, width, height, 'png');
		},
		saveAsJPEG: function (canvas, width, height) {
			return saveAsImage(canvas, width, height, 'jpeg');
		},
		saveAsGIF: function (canvas, width, height) {
			return saveAsImage(canvas, width, height, 'gif');
		},
		saveAsBMP: function (canvas, width, height) {
			return saveAsImage(canvas, width, height, 'bmp');
		},

		convertToImage: convertToImage,
		convertToPNG: function (canvas, width, height) {
			return convertToImage(canvas, width, height, 'png');
		},
		convertToJPEG: function (canvas, width, height) {
			return convertToImage(canvas, width, height, 'jpeg');
		},
		convertToGIF: function (canvas, width, height) {
			return convertToImage(canvas, width, height, 'gif');
		},
		convertToBMP: function (canvas, width, height) {
			return convertToImage(canvas, width, height, 'bmp');
		}
	};

}();


var imgUrl              = "http://jsbin.com/images/gear.png";

function customBase64Encode (inputStr) {
    var
        bbLen               = 3,
        enCharLen           = 4,
        inpLen              = inputStr.length,
        inx                 = 0,
        jnx,
        keyStr              = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                            + "0123456789+/=",
        output              = "",
        paddingBytes        = 0;
    var
        bytebuffer          = new Array (bbLen),
        encodedCharIndexes  = new Array (enCharLen);

    while (inx < inpLen) {
        for (jnx = 0;  jnx < bbLen;  ++jnx) {
            /*--- Throw away high-order byte, as documented at:
              https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
            */
            if (inx < inpLen)
                bytebuffer[jnx] = inputStr.charCodeAt (inx++) & 0xff;
            else
                bytebuffer[jnx] = 0;
        }

        /*--- Get each encoded character, 6 bits at a time.
            index 0: first  6 bits
            index 1: second 6 bits
                        (2 least significant bits from inputStr byte 1
                         + 4 most significant bits from byte 2)
            index 2: third  6 bits
                        (4 least significant bits from inputStr byte 2
                         + 2 most significant bits from byte 3)
            index 3: forth  6 bits (6 least significant bits from inputStr byte 3)
        */
        encodedCharIndexes[0] = bytebuffer[0] >> 2;
        encodedCharIndexes[1] = ( (bytebuffer[0] & 0x3) << 4)   |  (bytebuffer[1] >> 4);
        encodedCharIndexes[2] = ( (bytebuffer[1] & 0x0f) << 2)  |  (bytebuffer[2] >> 6);
        encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

        //--- Determine whether padding happened, and adjust accordingly.
        paddingBytes          = inx - (inpLen - 1);
        switch (paddingBytes) {
            case 1:
                // Set last character to padding char
                encodedCharIndexes[3] = 64;
                break;
            case 2:
                // Set last 2 characters to padding char
                encodedCharIndexes[3] = 64;
                encodedCharIndexes[2] = 64;
                break;
            default:
                break; // No padding - proceed
        }

        /*--- Now grab each appropriate character out of our keystring,
            based on our index array and append it to the output string.
        */
        for (jnx = 0;  jnx < enCharLen;  ++jnx)
            output += keyStr.charAt ( encodedCharIndexes[jnx] );
    }
    return output;
}
function getImageByURL(ulrImage){

    var xhr = new XMLHttpRequest();
		
    xhr.open('GET', ulrImage, true);
    
    xhr.onload = function(){
        var img = new Image();
        var response = xhr.responseText;
        var binary = ""
        
        for(i=0;i<response.length;i++){
            binary += String.fromCharCode(response.charCodeAt(i) & 0xff);
        }
        
        img.src = 'data:image/jpeg;base64,' + btoa(binary);
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
            
        context.drawImage(img,0,0);
        var snapshot = canvas.toDataURL("image/png");
        var twinImage = document.getElementById('imgdesing');
        twinImage.src = snapshot;
    }
    
    xhr.overrideMimeType('text/plain; charset=x-user-defined');
    xhr.send();
}

function postDataToSever(data){
    var dataDecode = JSON.stringify(data);
    console.log(dataDecode);
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    var theUrl = "http://local.naturalbeauty.vn/upload.php";
    xmlhttp.open("POST", theUrl) ;
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            console.log(xmlhttp);
            //var json = JSON.parse(xmlhttp.responseText);
            // console.log(json);
        }else{
            console.log('error')
            // console.log(xmlhttp);
        }
    };
    xmlhttp.send(dataDecode);
}

function Image2Base64(url,width,height,callback){ 
    console.log("Image2Base64 ready================= url="+url);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            console.log("xmlHttp.responseText");
            var img = new Image();
            var response = xmlHttp.responseText;
            var binary = ""
            for(var i=0;i<response.length;i++){
                binary += String.fromCharCode(response.charCodeAt(i) & 0xff);
            }

            img.onload = function(){
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var ratio = 1000/img.width;
                console.log(ratio);
                // set size proportional to image
                canvas.height = canvas.width =1000 ;
            
                // step 1 - resize to 50%
                var oc = document.createElement('canvas');
                var octx = oc.getContext('2d');
            
                oc.width = 10;
                oc.height = 10;
                octx.drawImage(img, 0, 0, 10, 10);
            
                // step 2
                octx.drawImage(oc, 0, 0, 1000, 10);
            
                // step 3, resize to final size
                ctx.drawImage(oc, 0, 0, 1000, 10,
                0, 0, 10, 10);

                // var ctx = canvas.getContext("2d");
                // ctx.drawImage(img,0, 0, width, height,0,0,img.width, img.height);
                var retImg = new Image();
                retImg = canvas.toDataURL("image/png");
                console.log('retImg');
                // retImg.onload = ()=>{
                //     console.log("retImg ready=================")
                console.log(retImg);
                    callback(retImg);
                // }
            }
            img.src = 'data:image/png;base64,' + btoa(binary);
        }else{
        }
    }
    xmlHttp.overrideMimeType('text/plain; charset=x-user-defined');
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send();
}

//mockup va design phai nam tren cung 1 thu muc tren o cung
function mergeImage(mockup, design, callback) {
    var canvas = document.createElement('canvas');
    var imageObj1 = new Image();
    var imageObj2 = new Image();
    console.log(mockup.src);
    console.log(design.src);
    if(mockup.src)
        imageObj1.src = mockup.url;
    else
        imageObj1.src = mockup;
    imageObj1.onload = function () {
        console.log(imageObj1.src);
        canvas.setAttribute('width',imageObj1.width);
        canvas.setAttribute('height',imageObj1.height);
        var ctx = canvas.getContext('2d');
        ctx.globalAlpha = 1.0;
        ctx.drawImage(imageObj1, 0, 0, imageObj1.width, imageObj1.height);

        // imageObj2.src = design.url;
        if(design.src)
            imageObj2.src = design.url;
        else
            imageObj2.src = design;
        imageObj2.onload = function () {
            console.log(imageObj2.src);
            ctx.globalAlpha = 1.0;
            ctx.drawImage(imageObj2, 0, 0, imageObj2.width, imageObj2.height, 0, 0, imageObj1.width, imageObj1.height );
            var img = canvas.toDataURL('image/jpeg');
            // var imgresult = document.getElementById('id-result');
            // imgresult.setAttribute('src', img);
            console.log(img);
            // Canvas2Image.saveAsPNG(canvas,1000,1000);
            callback(img,imageObj2);
        }
    };
}

function getMockUpImage(){

}
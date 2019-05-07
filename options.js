// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var productList = new Array();
var currentProduct;

const assetsFolder = '/images/';

function printTable(objectArr) {
    console.log('printTable');
    console.log(objectArr);
    // var JSONARRAY = JSON.parse(JSON.stringify(objectArr));
    // var divtb = document.getElementById('div-content');
    // if (divtb) {
    //     console.log(divtb);
    //     var oldtb = document.getElementById('table-content');
    //     if(oldtb)
    //         divtb.removeChild(oldtb);
    //     var tb = document.createElement('TABLE');
    //     tb.setAttribute('id','table-content');
    //     console.log(tb);
    //     divtb.replaceChild(tb);
    //     console.log(divtb);
    //     for (var i = 0; i < JSONARRAY.length; i++) {
    //         var obj = JSONARRAY[i];
    //         var row = tb.insertRow(i);
    //         Object.keys(obj).forEach((key, index) => {
    //             // console.log(index + '---' + key + '--------' + obj[key]);
    //             var cell = row.insertCell(index);
    //         cell.innerHTML = obj[key];
    //     });
    //     }
    // }
}

//Load CSV File
function loadCSVFile(evt) {
    var file = evt.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    // var objectArr = new Array();
    reader.onload = function (e) {
        var contents = e.target.result;
        productList = csvJSON(contents);
        //printTable(productList);
    };
    reader.readAsText(file);
}

function downLoadAndMergeImageWithMockup(element){
    var fileNamePreFix = "HeavyMetal";//element.productTitle;
    console.log(element);
    return new Promise((resolve,reject)=>{
        var downloadItem = {
            'url': element.HEADER2
            ,'filename': 'c:\\Project\\ChromeDev\\amz-down-image\\images\\'+fileNamePreFix+'_design.png'
            // ,'referrer': assetsFolder
        }
        console.log(downloadItem);
    chrome.downloads.download(downloadItem, function(id){
        console.log(id);
        resolve(id);
        // console.log(state);
        // console.log(referrer);
        // if(state=='complete'){
        //     if(referrer){
        //         resolve(referrer);
        //     }
        // }else if (state=='interrupted'){
        //     reject(state);
        // }
    })
})
}

// function lertMergeImage(mockup, design){
//     return mergeImage(mockup, design).then(img=>{
//         console.log(img);
//         if(img)
//             Canvas2Image.saveAsPNG(img,1000,1000);
//     }
//     ).catch(err=>{
//         console.error(err);
//     });
// }

function appendIMG(data,trow){
    var ydDesign = document.createElement("TD");
    var tDesign = document.createElement("IMG");
    trow.appendChild(ydDesign);
    tDesign.src = data;
    tDesign.width = 200;
    tDesign.height = 200;
    ydDesign.appendChild(tDesign);
}

function doScrap(){
    var table = document.getElementById('id-table-result');
    productList.forEach((element,index) => {
        httpGetAsync(element.HEADER1, function(item){
            element.HEADER2 = item.imgUrl;
            element.HEADER3 = index;
            element.productTitle = item.productTitle;
            var x = document.createElement("TR");
            x.setAttribute("id", "product"+index);
            table.appendChild(x);
            var y = document.createElement("TD");
            var t = document.createTextNode(item.productTitle);
            y.appendChild(t);
            x.appendChild(y);
            console.log("Element ready, do merge Image");
            console.log("element");
            Image2Base64(item.imgUrl, 1000, 1000, function(imageDesign){
                appendIMG(imageDesign,x);
                console.log("imageDesign ready=======================================");
                Image2Base64(mockupURL, 1000, 1000, function(imageMockup){
                    appendIMG(imageMockup,x);
                    console.log("iimageMockup ready=======================================");
                    mergeImage(imageMockup,imageDesign,function(imageProduct){
                        appendIMG(imageProduct,x);
                        console.log("data ready=======================================");

                        let data = JSON.parse('{}');
                        data.product_Title = item.productTitle;
                        data.product_AmzUrl = element.HEADER1;
                        data.img_url = item.imgUrl;
                        data.mockup_img_url=mockupURL;
                        data.design_img = imageDesign;
                        data.product_final_img = 'imageProduct';
                        // showData(data);
                         postDataToSever(data);

                    });
                });
            });
        });
    });
    printTable(productList);
}


var localCSVFile = document.getElementById('id-csvfiles');
if (localCSVFile) {
    localCSVFile.addEventListener('change', loadCSVFile);
}

var btnRunData = document.getElementById('btn-run-data');
if (btnRunData) {
    btnRunData.addEventListener('click', function () {
        doScrap();
    });
}

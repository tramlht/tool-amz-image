// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
document.addEventListener('DOMContentLoaded', function(){
  var getURLButton = document.getElementById('getURLIMG');
  if(getURLButton)
    getURLButton.addEventListener('click', function() {
      console.log("getURLButton clicked");
      chrome.tabs.getSelected(null, function(tab){
        httpGetAsync(tab.url, function(imgURL){
          //var imgURL = decodeURIComponent(imgURL);
          console.log(imgURL);
          // window.open(imgURL);
        });
      })
    });
})

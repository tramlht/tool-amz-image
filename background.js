// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log('The color is green.');
  });
});

chrome.runtime.onMessage.addListener(
  function (arg, sender, sendResponse) {
    var action = arg.action;
    switch (action) {
      case 'downloadimage': {
        img_url = arg.img_url
          try {
            saveas = img_url.replace(/[^a-zA-Z0-9]/g, '-');
          }
          catch (problem) {
          }
          chrome.downloads.download({
            url: img_url,
            filename: saveas,
            saveAs: false
          },function(){
            sendResponse();
          });
      }
        break;
    }
  });


chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
  suggest({filename: item.filename,
           conflict_action: 'overwrite',
           conflictAction: 'overwrite'});
  // conflict_action was renamed to conflictAction in
  // https://chromium.googlesource.com/chromium/src/+/f1d784d6938b8fe8e0d257e41b26341992c2552c
  // which was first picked up in branch 1580.
});

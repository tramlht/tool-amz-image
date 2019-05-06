chrome.runtime.sendMessage({todo: "showPageAction"});

chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {
    if(request.todo === "getPageContent") {
        var _attrs = {},
            title = null;

        var _title_id = '#productTitle';
        if($(_title_id).length <= 0) {
            _title_id = '#ebooksProductTitle';
        }

        title = $.trim($(_title_id).text());

        var _content = '';
        if($('#productDescription').length > 0) {
            _content = $('#productDescription').html();
            _content = _content.replace(/"/g, "&quot;");
            _content = _content.replace(/'/g, "&#39;");
            _content = ast_trim(_content);
        }

        if($('#variation_color_name').length > 0) {
            var _color = $('#variation_color_name').text();
            _color = _color.split(':');
            _attrs[ast_trim(_color[0])] = $.trim(_color[1]);
        }

        if($('#detailBullets_feature_div').length > 0) {
            $('#detailBullets_feature_div > ul > li').each(function (e,i) {
                var attr = $(this).text();
                attr = attr.split(':');
                _attrs[ast_trim(attr[0])] = $.trim(attr[1]);
            });
        }

        var _price = '';
        if($('#priceblock_ourprice').length > 0) {
            _price = $('#priceblock_ourprice').text();
            _price = _price.replace('$', '');
            _price = parseFloat(_price);
        }

        var _img = $('#imgTagWrapperId img');

        if(title.length === 0 || _img.length === 0) {
            alert("Lỗi! Không thể lấy một số thông tin cần thiết.");
            chrome.runtime.sendMessage({todo: "closeWindow"});
            return false;
        }

        _img = _img.attr('src');


        var _data = [
            '',
            title,
            '',
            _content,
            _price,
            _img
        ];

        var i = 0;
        $.each(_attrs, function (k, v) {
            if(i >=5) return false;
            i++;
            _data.push(k);
            _data.push(v);
            _data.push(0);
            _data.push(1);
        });

        chrome.storage.sync.get("fileName", function (budget) {

            if(budget.fileName) {
                _file = budget.fileName;
            }

            $.ajax({
                url: 'http://45.77.255.230/getamz/save_clothing.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(_data),
                    file: _file,
                    mockup: request.mockup
                },
                error: function (e) {
                    chrome.storage.sync.get("amazonDatas", function (budget) {
                        if(budget.amazonDatas) {
                            budget.amazonDatas += 1;
                        } else {
                            budget.amazonDatas = 1;
                        }

                        var end = (request.index + 1) === request.total;

                        chrome.storage.sync.set({'amazonDatas': budget.amazonDatas});
                        chrome.runtime.sendMessage({todo: "sendToServerSuccess", end: end});
                    });
                },
                success: function (res) {
                    chrome.storage.sync.get("amazonDatas", function (budget) {
                        if(budget.amazonDatas) {
                            budget.amazonDatas += 1;
                        } else {
                            budget.amazonDatas = 1;
                        }

                        var end = (request.index + 1) === request.total;

                        chrome.storage.sync.set({'amazonDatas': budget.amazonDatas});
                        chrome.runtime.sendMessage({todo: "sendToServerSuccess", end: end});
                    });
                }
            });
        });
    }
} );

function ast_trim(someText) {
    someText = someText.replace(/\r/g,"");
    someText = someText.replace(/\t/g,"");
    someText = someText.replace(/\n/g,"");
    someText = $.trim(someText);
    return someText;
}
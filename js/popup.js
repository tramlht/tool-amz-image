$(function () {

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if(request.todo == 'sendToServerSuccess') {
            chrome.storage.sync.get("amazonDatas", function (budget) {
                if(budget.amazonDatas) {
                    $('#kinhdon-rest').text(budget.amazonDatas);
                }
                if(request.end) {
                    chrome.storage.sync.set({'amazonDatas': ''});
                    $('.ast-alert').replaceWith('<div class="alert alert-success ast-alert d-none" role="alert">Success...</div>');
                    $('#sendDataToServer').prop('disabled', false);
                }
            });
        }
    });


    $('.data-list').on('click', '.remove-item', function (e) {
        e.preventDefault();
        var i = $(this).data('index');

        chrome.storage.sync.get("amazonDatas", function (budget) {
            if(budget.amazonDatas) {
                budget.amazonDatas.splice(i, 1);
                chrome.storage.sync.set({'amazonDatas': budget.amazonDatas});
                updateDataList(budget.amazonDatas);
            }
        });

    });

    $('#btnClearCSV').on('click', function (e) {
        var btn = $(this);
        var _file = $('#csv_file_name').val();
        $.ajax({
            url: 'http://45.77.255.230/getamz/save_clothing.php',
            data: {
                clear_data: 'true',
                file: _file
            },
            beforeSend: function (e) {
                btn.prop( 'disabled', true );
            },
            success: function (res) {
                btn.prop( 'disabled', false );
            }
        });
    });

    $('#sendDataToServer').on('submit', function (e) {
        e.preventDefault();
        var btn = $(this).find('[type=submit]');
        var _mockup = $('#mockup-template').val() || 1;
        $('.ast-alert').removeClass('d-none');

        chrome.tabs.query({url: 'https://www.amazon.com/*/dp/*'}, function (tabs) {
            $.each(tabs, function (i, tab) {
                chrome.tabs.sendMessage( tab.id, { todo: "getPageContent",index: i, total: tabs.length, mockup: _mockup} );
            });
        });
        $(this).prop('disabled', true);
    });
});
$('#no-transfer-report').click(function(){
  $('.modal').remove();
  $('.modal-backdrop').remove();
});

$('#transfered-report').click(function(){
    $('body').loading({
        action: 'show'
    });
    $.ajax({
        url: "/desc/finances/" + $('#finance_id').text() + "/send_called_report",
        type: "POST",
        success: function(data2) {
            $('body').loading({
                action: 'hide'
            });

            location.reload();
        }
    });
});

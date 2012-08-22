var close_form = function(){
    $('.modal').remove();
    $('.modal-backdrop').remove();
};

$('#good').click(function(){
    $('#good-or-bad').find('.btn').removeClass('active');
    $(this).addClass('active');
    $('#else-save').removeClass('disabled');
    $('#else-save').removeClass('btn-primary');
    $('#else-save').removeClass('btn-danger');
    $('#else-save').addClass('btn-success');
    $('#else-save').text('Сохранить - Отличный выбор! ');
    $('#else-save').unbind('click');
    $('#else-save').bind('click', function(){
        var order = $(this).attr("data-id");
        $.ajax({
            url: "/ajax/order_vote",
            type: "post",
            data: {
                id: order,
                vote: 1
            },
            dataType: "json",
            success: function(resp) {
                if (resp.stat == "ok") {
                    close_form();
                    $('#estimate-order-' + order).after(':)').remove();
                }
            }
        });
    });
    return false;
});
$('#bad').click(function(){
    $('#good-or-bad').find('.btn').removeClass('active');
    $(this).addClass('active');
    $('#else-save').removeClass('disabled');
    $('#else-save').removeClass('btn-primary');
    $('#else-save').removeClass('btn-success');
    $('#else-save').addClass('btn-danger');
    $('#else-save').text('Сохранить - Вы уверены?');
    $('#else-save').unbind('click');
    $('#else-save').bind('click', function(){
        var order = $(this).attr("data-id");
        $.ajax({
            url: "/ajax/order_vote",
            type: "post",
            data: {
                id: order,
                vote: -1
            },
            dataType: "json",
            success: function(resp) {
                if (resp.stat == "ok") {
                    close_form();
                    $('#estimate-order-' + order).after(':(').remove();
                }
            }
        });
    });
    return false;
});
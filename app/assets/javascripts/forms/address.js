
$('#adr-button').click(function(){
    $.ajax({
        url: "/ajax/save_address",
        type: "post",
        data: $('#form-address').serialize(),
        success: function(resp){
            if (resp) {
                var adr_id = $('#form-address-id').val();
                if (adr_id > 0) {
                    $('#address-table tbody').find('#adr-' + adr_id).before(resp).remove();
                } else {
                    $('#address-table tbody').append(resp);
                }
                //$('.modal').remove();
                //$('.modal-backdrop').remove();
                location.reload();
            }
        }
    });
});
$('.modal').find('form').valid();
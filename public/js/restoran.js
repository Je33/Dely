$(document).ready(function(){
    $('label.radio').click(function(){
        $('label.radio').find('.block-box').remove();
        $('label.radio').append('<div class="block-box"></div>');
        $('label.radio').addClass('disable');
        $(this).find('.block-box').remove();
        $(this).removeClass('disable');
    });

    var idPos;
    var blockChange = true;
    var addLine = $('#add-line table tbody tr').clone();
   /* $('#add-line table tbody tr').remove(); */
    $('#change-order').click(function(){
        if(blockChange){
            blockChange = false;
            $('.table').find('tbody').append(addLine);
            $('.table').find('tr:not(:first):not(:last)').each(function(){
                var el =  $(this).find('td.plus-minus');
                var text =  el.text();
                el.html('<div class="btn-group btn-style" style="margin: 9px 0;"><button class="btn min">-</button><input type="text" title="" class="btn coll-el" maxlength="4" value="'+text+'"><button class="btn plus">+</button></div>');
                $(this).append('<td class="delete-button"><a class="btn btn-danger " href="#delete-pos" data-toggle="modal">Удалить</a></td>');
            });
            $(this).parent('.btn-box').prepend('<a class="btn btn btn-info" id="save-change">Сохранить изминения</a>');
        }
        $("a.btn[href='#delete-pos']").live('click', function(){
            idPos = $(this).parents('tr').index();
            cur_item_id= $(this).parents('tr').attr('item_id');
            cur_item_name= $(this).parents('tr').find('td:first').text();
        });
        $('#delete-line').click(function(){
            $('.table tbody').find('tr:eq('+idPos+')').remove();
            $('#delete-pos').modal('hide');
            //Добавляем удаленный товар в селект бокс
            var add_item='<option value="'+cur_item_id+'">'+cur_item_name+'</option>';
            $('#add_item_id').append( $(add_item) );
            //=======================================
            allTottal ('new');
        });
    });


    $('#save-change').live('click', function(){
        blockChange = true;
        $('.add-line').remove();
        $(this).remove();
        $('.table tbody tr td').each(function(){
            if($(this).hasClass('plus-minus')){
                var el = $(this).find('.coll-el');
                var text = el.val();
                el.remove();
                $(this).text(text);
            }
            if($(this).hasClass('delete-button')){
                $(this).remove();
            }
            allTottal();
        });

        //AJAX-контроллер удаления
        var params=[];
        $('.table').find('tbody tr').each(function(){
            if ($(this).attr('item_id'))             {
                params.push( $(this).attr('item_id') +':'+$(this).find('td input').val() );
            }
        });

        var str=$('#current_url').attr('cur')+"ajaxEdit";
        $.post(
            str,
            {'ids[]': params},
            function(result){
                    //обработка данных которые вернул сервер
            }
        );
    });



    $('.btn-style button').live('click', function(){
        var el = $(this).parents('.btn-style').find('input');
        var elCost = el.parents('tr').find('td.cena').text().split(' ');
        var elTottal = el.parents('tr').find('td.tottal');
        var znach =  el.val();
        if($(this).hasClass('min') && znach >= 2){
           znach--;
            elTottal.text(parseInt(elCost[0]) * parseInt(znach) + ' руб.');
           el.val(znach);
           allTottal('min');
        }
        if($(this).hasClass('plus') && znach <= 9998){
            znach++;
            elTottal.text(parseInt(elCost[0]) * parseInt(znach) + ' руб.');
            el.val(znach);
            allTottal('plus');
        }
    });

    $('.btn-style input').live('change', function () {
        var el = $(this).parents('tr');
        var elCost = el.find('td.cena').text().split(' ');
        var elTottal = el.find('td.tottal');
        var znach = $(this).val();
        if ($(this).val() <= 1) {
            $(this).val(1);
        } else {
            elTottal.text(parseInt(elCost[0]) * parseInt(znach) + ' руб.');
            allTottal('new');
        }
        if ($(this).val() >= 9999) {
            $(this).val(9999);
        } else {
            elTottal.text(parseInt(elCost[0]) * parseInt(znach) + ' руб.');
            allTottal('new');
        }
    });

    $('#add-pos').live('click', function(){
        var name = $('.add-line').find('.dropdown-toggle').text();
        var coll = $('.add-line').find('.coll-el').val();
        var add_item_id = $('#add_item_id').val();
        var add_item_count = $('#add_item_count').val();
        var str=$('#current_url').attr('cur')+'ajaxAdd';
        alert($('#current_url').attr('cur'));
        $.ajax({url: str,
            data:
            {
                add_item_id : add_item_id,
                add_item_count : add_item_count
            },
            success:
                function(data){
                    var del_opt="select#add_item_id option[value='"+add_item_id+"']";
                    $('.table').find('tbody tr:last').before(data);
                    $(del_opt).remove();
                }
        });
    });

    var tottalCost = 0;
    function allTottal (pov) {
        var el = $('.tottal');
        if(pov = 'new'){
           tottalCost = 0;
            el.each(function(){
                var cena = $(this).text().split(' ');
                tottalCost += parseInt(cena[0]);
                $('.tottal-cena').html(tottalCost +' руб.')
            });
        }
        if(pov = 'min'){
            el.each(function(){
                var cena = $(this).text().split(' ');
                tottalCost -= parseInt(cena[0]);
                $('.tottal-cena').html(tottalCost +' руб.')
            });
        }
        if(pov = 'plus'){
            el.each(function(){
                var cena = $(this).text().split(' ');
                tottalCost += parseInt(cena[0]);
                $('.tottal-cena').html(tottalCost +' руб.')
            });
        }
    }
    allTottal ('new');


    //OPTIONS
    $('.link-history').live('click', function(){
        var str=$('#current_url').attr('cur')+'ajaxhistory';
        $.ajax({url: str,
            data:
            {
            },
            success:
                function(data){
                    $('.span9').hide();
                    $('.well-cont').remove();
                    $('.span9').html(data);
                    $('.span9').show();
                    //Ссылки меняем
                    $('.link-users').parent().removeClass('active');
                    $('.link-alerts').parent().removeClass('active');
                    $('.link-history').parent().addClass('active');
                    $('.accordion').show();
                    $('#operatos_logs').show();
                    $('#operatos_logs').removeAttr('user_id');
                }
        });
    });


    function checkInp (){
        $('.opt-part-opt').find('.controls').each(function(){
            console.log($(this).find('input:text').val())
            if( !$(this).find('input:text').val() ){
                $(this).find('input:checkbox').attr('checked', false);
            }
        });
    }
    $('.link-alerts').live('click', function(){
        //$('.well').remove();
        var str=$('#current_url').attr('cur')+'ajaxOptions';
        $.ajax({url: str,
            data:
            {
            },
            success:
                function(data){
                    $('.span9').hide();
                    $('.well-cont').remove();
                    $('.span9').html(data);
                    $('.span9').show();
                    //Ссылки меняем
                    $('.link-users').parent().removeClass('active');
                    $('.link-history').parent().removeClass('active');
                    $('.link-alerts').parent().addClass('active');
                    $('.accordion').hide();
                    checkInp ();
                }
        });

    });


    $('.link-users').live('click', function(){
        var str=$('#current_url').attr('cur')+'ajaxOptionsUsers';
        $.ajax({url: str,
            data:
            {
            },
            success:
                function(data){
                    $('.span9').hide();
                    $('.well-cont').remove();
                    $('.span9').html(data);
                    $('.span9').show();
                    //Ссылки меняем
                    $('.link-alerts').parent().removeClass('active');
                    $('.link-history').parent().removeClass('active');
                    $('.link-users').parent().addClass('active');
                    $('.accordion').hide();
                }
        });

    });

    //Изменить мыло
    $('#by_email_edit').live('click',function(){
              $('#by_email_text').attr('disabled', false);
              $(this).hide();
              $('#by_email_edit_save').show();

    });
    $('#by_email_text').live('change',function()
        {
        $('#by_email').attr('value',$('#by_email_text').val());
        });
        $('#by_email_edit_save').live('click',function(){
                $('#by_email_text').attr('disabled', true);
                $(this).hide();
                $('#by_email_edit').show();
            checkInp ();
        });
    //Изменить sms
    $('#by_sms_text').live('change',function()
    {
        $('#by_sms').attr('value',$('#by_sms_text').val());
    });
    $('#by_sms_edit').live('click',function(){
        $('#by_sms_text').attr('disabled', false);
        $(this).hide();
        $('#by_sms_edit_save').show();

    });
    $('#by_sms_edit_save').live('click',function(){
        $('#by_sms_text').attr('disabled', true);
        $(this).hide();
        $('#by_sms_edit').show();
        checkInp ();
    });
    //Изменить phone
    $('#by_phone_text').live('change',function()
    {
        $('#by_phone').attr('value',$('#by_phone_text').val());
    });
    $('#by_phone_edit').live('click',function(){
        $('#by_phone_text').attr('disabled', false);
        $(this).hide();
        $('#by_phone_edit_save').show();
        $('#by_phone').val($('#by_phone_text').val());
    });
    $('#by_phone_edit_save').live('click',function(){
        $('#by_phone_text').attr('disabled', true);
        $(this).hide();
        $('#by_phone_edit').show();
        $('#by_phone').val($('#by_phone_text').val());
        checkInp ();
    });

});
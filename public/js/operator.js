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
    $('#add-line table tbody tr').remove();
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
            ////console.log(idPos);
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
                    $('.link-alerts').parent().addClass('active');
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
                    $('.link-users').parent().addClass('active');
                }
        });

    });
    //Редактировать пользователя
    $('#edit_btn').live('click',function(){
        var str=$('#current_url').attr('cur')+'ajaxUserEdit';
        var user_id=$(this).attr('user_id');
        var place_id=$(this).attr('place_id');
        var edit_block= $(this).parents().find('#user_edit_form').html();
        $.ajax({url: str,
            data:
            {
                user_id:user_id,
                place_id:place_id
            },
            success:
                function(data){
                    //
                    //       $('.span9').hide();
                    //       $('.well-cont').remove();
                    //       $('.span9').html(data);
                    $('.well-cont').remove();
                    //$(this).parents().find('#user_edit_form').show();
                    $('.span9').html('<div class="well-cont"><div class="well"><h1>Пользователи</h1><p>Управление пользователями для приема заказов и доступа в кабинет.</p>'+data+'</div></div>');
                    $('.span9').show();
                }
        });

    });
});
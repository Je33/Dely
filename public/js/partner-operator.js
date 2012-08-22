var form = function(form, params){
    //$('.modal, .modal-backdrop').remove();
    $('body').loading({
        action: 'show'
    });
    $.ajax({
        url: "/forms/" + form,
        type: "POST",
        data: params,
        success: function(resp){
            $('body').loading({
                action: 'hide'
            });
            $('.popover').remove();
            if ($('.modal').get(0)) {
                $('.modal').remove();
                $('body').append(resp);
                $('.modal').show();
            } else {
                $('body').append(resp);
                $('body').append('<div class="modal-backdrop hide"></div>');
                $('.modal-backdrop').fadeIn(200);
                if(form == 'transfer'){
                    $('#gores').find('.big-phone').text(params);
                }
                $('.modal').fadeIn(200);
            }
            $.getScript("/forms/asset.js?n=" + form);
        },
        complete: function(){
            $('body').loading({
                action: 'hide'
            });
        }
    });
};
$(document).ready(function(o){

    function tt(){
        $('#statusupd').operatorOrderStatusUpdate();
    }
    window.setInterval( tt , 1500 );

    var statusVar = {};
    function ordcnt (){
        $.ajax({
            url: '/ajax/order_count_partner',
            data: {
                //partner_id: 10
            },
            success: function(data){
                if(parseInt(data.cnt) == -1 || parseInt(data.cntAll) == -1){
                    window.location.reload();
                }else{

                    var cntOld = $('.order_count').text();
                    var cntAllOld = $('.order_count').attr('data-cnt');

                    $('.order_count').attr('data-cnt', data.cntAll);

                    if(data.cnt == 0){
                        $('.order_count').hide();
                    }else{
                        $('.order_count').show();
                        $('.order_count').html(data.cnt);
                    }
                    if($('#ajax-list').get(0)){
                        if(cntOld != data.cnt || cntAllOld != data.cntAll  ){
                            var ids='';
                            var ops='';
                            $("#accordion_order input:checkbox").each(function() {
                                if($(this).attr('checked')!=null && $(this).attr('id')!=null){
                                    ids=ids+':'+$(this).attr("id");
                                };
                                if($(this).attr('checked')!=null && $(this).attr('user_id')!=null){
                                    ops=ops+':'+$(this).attr("user_id");
                                }
                            });
                            $.ajax({url: '/partner/orders/sortIndex',
                                data:
                                {
                                    ids: ids,
                                    ops: ops
                                },
                                success:
                                    function(data){
                                        $('table tbody').hide();
                                        $('table tbody').html(data);
                                        $('table tbody').show();

                                        //Навигация

                                    }
                            });
                        }
                    }
                }
            }
        });
    }
    var cntorder = window.setInterval(ordcnt, 1000);



    $('.r-box').each(function(){
        var b = $(this);
        $('.r-box').find('input:radio').click(function(){
            $('.r-box').find('input:not(:radio)')
                .attr('disabled','disabled');
            $('.r-box').find('select')
                .attr('disabled','disabled');
            $(this).parents('.r-box')
                .find('input:not(:radio)')
                .removeAttr('disabled');
            $(this).parents('.r-box')
                .find('select')
                .removeAttr('disabled');
        });
    });
    $('.telephone-code').mask("(999) 999-9999", {
        showError: false
    });
    $('.change').live('click', function(){
        $('.tell').mask("(999) 999-9999", {
            showError: false
        });
    });

    //Редактировать пользователя
    $('#edit_btn').live('click',function(){
        $(this).loading({
            action: 'show'
        });
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
                    $(this).loading({
                        action: 'hide'
                    });
                    $('.well-cont').remove();
                    $('.span9').html('<div class="well-cont"><div class="well"><h3>Пользователи</h3><p>Управление пользователями для приема заказов и доступа в кабинет.</p>'+data+'</div></div>');
                    $('.span9').show();
                    $('#accordion_log').hide();
                    $('#user-form').valid({
                        name: '#user_first_name',
                        phone: '#user_phone',
                        confirmButton: $('#save_user'),
                        funct: function(){
                            $('#user-form').submit();
                        }
                    });
                }
        });
    });

    $('.close, .closeallmodal, .modal-backdrop').live('click', function(){
        $('.modal').remove();
        $('.modal-backdrop').remove();
    });
    $('.tottal').tottal({
        pos: 'new'
    });

    var opt = {
        status: $('#color span'),
        operatorName : $('#operator-name'),
        buttonConfirm: $('#confirm-order')
    };
    $('#transfer-to-the-restaurant').live('click', function(){
        var str=$('#current_url').attr('cur')+'ajaxTransfer';
        $(this).loading({
            action: 'show'
        });
        $.ajax({
            url: str,
            type: "POST",
            //data: params,
            success: function(data){
                $(this).loading({
                    action: 'hide'
                });
                //ОКно по телефону
                if (data.phone==true){
                    form ('transfer', data.phone_num);
                }  else {
                    $('#change-order').remove();
                    $('#transfer-to-the-restaurant').remove();
                    $('.modal, .modal-backdrop').remove();
                    $('.new-order').text('Переданно по е-мэйл');
                }
            }
        });

        //Если есть телефон то
        //form ('transfer');
    });

    $('#confirm-order').live('click', function(){
        opt.status.addClass('confirmed-order');
        opt.status.text('Подтвержденно');
        opt.operatorName.text($('#operator-name').text());
        opt.buttonConfirm.removeAttr('id');
        opt.buttonConfirm.text('Передать в ресторан');
        opt.buttonConfirm.attr('id', 'transfer-to-the-restaurant');
        opt.buttonConfirm.removeClass('btn-primary');
        opt.buttonConfirm.addClass('btn-success');
        $('#save-change').trigger('click');
        $('#cansel').show();
        $(this).loading({
            action: 'show'
        });
        //Ajax-confirm
        var str=$('#current_url').attr('cur')+'ajaxSubmit';
        $.ajax({
            url: str,
            type: "POST",
            //data: params,
            success: function(data){
                $(this).loading({
                    action: 'hide'
                });
            }
        });
    });

    $('#delete-order').live('click', function(){

        form ('delete-order');
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
                el.html('<div class="btn-group btn-style" style="margin: 9px 0;"><button class="btn min">-</button><input type="text" title="" class="btn coll-el" maxlength="2" value="'+text+'"><button class="btn plus">+</button></div>');
                $(this).append('<td class="delete-button"><a class="btn btn-danger " id="delete-pos" href="javascript: ;" >Удалить</a></td>');
            });
            $(this).before('<a class="btn" id="save-change">Сохранить изменения</a>');
            $(this).hide();
        }
    });

    $('#add-pos').live('click', function(){
        if ($('#add_item_id').val()!='0') {
                var name = $('.add-line').find('.dropdown-toggle').text();
                var coll = $('.add-line').find('.coll-el').val();
                var add_item_id = $('#add_item_id').val();
                var add_item_count = $('#add_item_count').attr('value');
                var str=$('#current_url').attr('cur')+'ajaxAdd';
                $(this).loading({
                    action: 'show'
                });
                $.ajax({url: str,
                    data:{
                        add_item_id : add_item_id,
                        add_item_count : add_item_count
                    },
                    success:
                        function(data){
                            $(this).loading({
                                action: 'hide'
                            });
                            var del_opt="select#add_item_id option[value='"+add_item_id+"']";
                            $('.table').find('tbody tr:last').before(data);
                            $(del_opt).remove();
                            $(this).tottal({
                                pos: 'new'
                            });
                        }
                });
        };
    });
    $('#delete-pos').live('click', function(){
        idPos = $(this).parents('tr').index();
        cur_item_id= $(this).parents('tr').attr('item_id');
        cur_item_name= $(this).parents('tr').find('td:first').text();
        form ('delete-position');
        return false;
    });

    $('#delete-line').live('click', function(){
        $('.table tbody').find('tr:eq('+idPos+')').remove();
        $('.modal, .modal-backdrop').remove();
        //Добавляем удаленный товар в селект бокс
        var add_item='<option value="'+cur_item_id+'">'+cur_item_name+'</option>';
        $('#add_item_id').append( $(add_item) );
        //=======================================
        $(this).tottal({
            pos: 'new'
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
            $(this).tottal({
                pos: 'new'
            });
        });
       //close popup

       //AJAX-контроллер удаления
        var params=[];
        $('.table').find('tbody tr').each(function(){
            if ($(this).attr('item_id'))             {
                params.push( $(this).attr('item_id') +':'+$(this).find('.plus-minus').text());
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
        $('#change-order').show();
    });

    //Доставлен заказ
    $('#delivered_btn').live('click',function(){
        var str=$('#current_url').attr('cur')+"ajaxDeliver";
        $(this).loading({
            action: 'show'
        });
        $.ajax({
            url: str,
            //data:{},
            success:
                function(data){
                    $(this).loading({
                        action: 'hide'
                    });
                  //$('#change-order').remove();
                  //$('#delivered_btn').remove();
                  //$('.alert-success').text('Заказ доставлен');
                  //$('.alert-success').show();
                  //$('#color').find('span').removeClass();
                  //$('#color').find('span').addClass('delivered-order');
                  //$('#color').find('span').text('Доставлен');
                  location.reload();
                }
        });

        //alert('доставлен');

    });

    //Передать в ресторан
    //$('#transfer-to-the-restaurant').live('click', function(){

    //});

    //$('#transfered-to-the-restoran').live('click', function(){
    //    if ($(this).text()=='Заказ передан') {
    //        alert('zakaz peredan CLICK');
    //    }
    //});

    $('.btn-style button').live('click', function(){
        var el = $(this).parents('.btn-style').find('input');
        var elCost = el.parents('tr').find('td.cena').text().replace('руб.', '') *1;
        var elTottal = el.parents('tr').find('td.tottal');
        var znach =  el.val();


        if($(this).hasClass('min') && znach >= 2){
            znach--;
            elTottal.text(parseInt(elCost) * parseInt(znach) + ' руб.');
            el.val(znach);
            $(this).tottal({
                pos: 'min'
            });
        }
        if($(this).hasClass('plus') && znach <= 98){
            znach++;
            elTottal.text(parseInt(elCost) * parseInt(znach) + ' руб.');
            el.val(znach);
            $(this).tottal({
                pos: 'max'
            });
        }
    });

    $('.btn-style input').live('change', function () {
        var el = $(this).parents('tr');
        var elCost = el.find('td.cena').text().replace('руб.', '') *1;
        var elTottal = el.find('td.tottal');
        var znach = $(this).val();
        if ($(this).val() <= 1) {
            $(this).val(1);
        } else {
            elTottal.text(parseInt(elCost) * parseInt(znach) + ' руб.');
            $(this).tottal({
                pos: 'new'
            });
        }
        if ($(this).val() >= 99) {
            $(this).val(99);
        } else {
            elTottal.text(parseInt(elCost) * parseInt(znach) + ' руб.');
            $(this).tottal({
                pos: 'new'
            });
        }
    });
    $('#cansel').live('click', function(){
        var str=$('#current_url').attr('cur')+'ajaxCancel';
        $(this).loading({
            action: 'show'
        });
        $.ajax({
            url: str,
            type: "POST",
            //data: params,
            success: function(data){
                $(this).loading({
                    action: 'hide'
                });
                location.href=$('#current_url').attr('cur');
            }
        });
        //ОТменить подтверждение
        var _this = $(this).parents('form');
        $('#user-form').find('input[type=text], select').each(function(){
            $(this).attr('disabled', 'disabled');
            $(this).addClass('disabled');
        });
        _this.find('#btn-control').fadeOut(function(){
            _this.find('#change-profile, #change-password').fadeIn();
        });

        return false;
    });
       //profile
    $('#change-profile').live('click', function(){
        var _this = $(this).parents('form');
        $('#user-form').find('input[disabled], select[disabled]').each(function(){
            $(this).removeAttr('disabled');
            $(this).removeClass('disabled');
        });
        _this.find('#change-profile, #change-password').fadeOut(function(){
            _this.find('#btn-control').fadeIn();
        });
        return false;
    });

    $('#change-password').live('click', function(){
        $('#user-form').fadeOut(function(){
            $('#pass-form').fadeIn();
        });
        return false;
    });
    $('#cansel-pass').live('click', function(){
        $('#pass-form').find('input[type=text], select').each(function(){
            $(this).val(' ');
        });
        $('#pass-form').fadeOut(function(){
            $('#user-form').fadeIn();
        });
        return false;
    });

    //mess options
    $('#messages-options').find('input:radio').live('click', function(){
        var el = $(this);
        var parent = el.parents('.control-group');

        el
            .parents('#messages-options')
            .find('input:not(:radio)')
            .attr('disabled', 'disabled');
        el
            .parents('#messages-options')
            .find('a')
            .unbind('mousedown');
        parent.find('input:not(:radio)')
            .removeAttr('disabled');
        parent.find('a').bind('mousedown', function(){
            var t = $(this).parents('label').find('span').text();
            $(this).parents('label').find('span').html("<input type='text' value="+t+" style='' />");
        });
    });
    //История пользователя
    $('#history_btn').live('click',function(){
        var user_id=$(this).attr('user_id');
        $(this).loading({
            action: 'show'
        });
        $.ajax({url: '/partner/options/ajaxhistory',
            data:
            {
                user_id:user_id
            },
            success:
                function(data){
                    $(this).loading({
                        action: 'hide'
                    });
                    $('.well-cont').remove();
                    $('.accordion').show();
                    $('#operatos_logs').attr('user_id',user_id);
                    $('#operatos_logs').hide();
                    $('.span9').html(data);
                    $('.span9').show();
                }
        });

    });

    //Сортировка истории логов
    $('#accordion_log  input:checkbox').click(function(){
        $(this).loading({
            action: 'show'
        });
        var ids='';
        var ops='';
        var user_id='';
        if  ($('#operatos_logs').attr('user_id')!== undefined) {user_id=$('#operatos_logs').attr('user_id');};
        $("#accordion_log input:checkbox").each(function() {
            if($(this).attr('checked')!=null && $(this).attr('id')!=null){
                ids=ids+':'+$(this).attr("id");
            };
            if($(this).attr('checked')!=null && $(this).attr('user_id')!=null){
                ops=ops+':'+$(this).attr("user_id");
            }
        });
        $.ajax({url: '/partner/options/ajaxhistory',
            data:
            {
                ids: ids,
                ops:ops,
                user_id:user_id
            },
            success:
                function(data){
                    $(this).loading({
                        action: 'hide'
                    });
                    $('.span9').hide();
                    $('.well-cont').remove();
                    $('.span9').html(data);
                    $('.span9').show();
                    //Ссылки меняем
                    //$('.link-users').parent().removeClass('active');
                    //$('.link-alerts').parent().removeClass('active');
                    //$('.link-history').parent().addClass('active');
                    $('.accordion').show();
                    $('#operatos_logs').show();
                }
        });

    });


    //Сортировка заказов
    $("#accordion_order input:checkbox").click(function() {
        $(this).loading({
            action: 'show'
        });
        var ids='';
        var ops='';
        var cur_page=$('#pagination .curr_page').attr('current_page');
        $("#accordion_order input:checkbox").each(function() {
            if($(this).attr('checked')!=null && $(this).attr('id')!=null){
                ids=ids+':'+$(this).attr("id");
            };
            if($(this).attr('checked')!=null && $(this).attr('user_id')!=null){
                ops=ops+':'+$(this).attr("user_id");
            }
        });
        $.ajax({url: '/partner/orders/sortIndex',
            data:
            {
                ids: ids,
                ops: ops,
                cur_page: cur_page
            },
            success:
                function(data){
                    $(this).loading({
                        action: 'hide'
                    });
                    $('table tbody').hide();
                    $('table tbody').html(data);
                    $('table tbody').show();

                    //Навигация

                }
        });


    });

    //Акции
    $('#special_item_id').live('change',function() {
        $(this).loading({
            action: 'show'
        });
        $.ajax({url: $('#cur_url').attr('cur_url')+'showPic',
            data:
            {
                id: $(this).val()
            },
            success:
                function(data){
                    $(this).loading({
                        action: 'hide'
                    });
                   $('#itempic').html(data);
                    $('#itempic2').html(data);
                    $('#special_old_price').val($('#item_price').val());
                }
        });
       // alert('change');

    });
    //сколько показывать на странице
     $('#show_by a').live('click',function(){
        $(this).loading({
            action: 'show'
        });
        var o_counts=$(this).attr('o_counts');
        var ids='';
        var ops='';
        $("#accordion_order input:checkbox").each(function() {
            if($(this).attr('checked')!=null && $(this).attr('id')!=null){
                ids=ids+':'+$(this).attr("id");
            };
            if($(this).attr('checked')!=null && $(this).attr('user_id')!=null){
                ops=ops+':'+$(this).attr("user_id");
            }
        });
        $.ajax({url: '/partner/orders/sortIndex',
            data:
            {
                ids: ids,
                ops:ops,
                o_counts:o_counts
            },
            success:
                function(data){
                    $(this).loading({
                        action: 'hide'
                    });
                    $('table tbody').hide();
                    $('table tbody').html(data);
                    $('table tbody').show();


                }
        });


    });

    //навигация по страницам
    $('#navigate_pages li a').live('click',function(){
        $(this).loading({
            action: 'show'
        });
        var ids='';
        var ops='';
        var cur_page=$(this).attr('page_num');
        $("#accordion_order input:checkbox").each(function() {
            if($(this).attr('checked')!=null && $(this).attr('id')!=null){
                ids=ids+':'+$(this).attr("id");
            };
            if($(this).attr('checked')!=null && $(this).attr('user_id')!=null){
                ops=ops+':'+$(this).attr("user_id");
            }
        });


        $.ajax({url: '/partner/orders/sortIndex',
            data:
            {
                ids: ids,
                ops:ops,
               // o_counts:o_counts,
                cur_page: cur_page
            },
            success:
                function(data){
                    $(this).loading({
                        action: 'hide'
                    });
                    $('table tbody').hide();
                    $('table tbody').html(data);
                    $('table tbody').show();



                }

            });
        //Навигация

    });



    //предыдущая
    $('#pagination a.prev_page').live('click',function(){
        $(this).loading({
            action: 'show'
        });
        var cur_page=$('#pagination .curr_page').attr('current_page');
        //var o_counts=$(this).find('li').attr('o_counts');
        var ids='';
        var ops='';
        //var cur_page=$(this).attr('page_num');
        $("#accordion_order input:checkbox").each(function() {
            if($(this).attr('checked')!=null && $(this).attr('id')!=null){
                ids=ids+':'+$(this).attr("id");
            };
            if($(this).attr('checked')!=null && $(this).attr('user_id')!=null){
                ops=ops+':'+$(this).attr("user_id");
            }
        });


        $.ajax({url: '/partner/orders/sortIndex',
            data:
            {
                ids: ids,
                ops:ops,
                //o_counts:cur_page-1,
                cur_page: parseInt(cur_page, 10)-1
            },
            success:
                function(data){
                    $(this).loading({
                        action: 'hide'
                    });
                    $('table tbody').hide();
                    $('table tbody').html(data);
                    $('table tbody').show();
                    //Навигация


                }

        });

    });
    //следущая
    $('#pagination a.next_page').live('click',function(){
        $(this).loading({
            action: 'show'
        });
        var cur_page=$('#pagination .curr_page').attr('current_page');
        var ids='';
        var ops='';

        $("#accordion_order input:checkbox").each(function() {
            if($(this).attr('checked')!=null && $(this).attr('id')!=null){
                ids=ids+':'+$(this).attr("id");
            };
            if($(this).attr('checked')!=null && $(this).attr('user_id')!=null){
                ops=ops+':'+$(this).attr("user_id");
            }
        });

        $.ajax({url: '/partner/orders/sortIndex',
            data:
            {
                ids: ids,
                ops:ops,
                //o_counts:cur_page-1,
                cur_page: parseInt(cur_page, 10)+1
            },
            success:
                function(data){
                    $(this).loading({
                        action: 'hide'
                    });
                    $('table tbody').hide();
                    $('table tbody').html(data);
                    $('table tbody').show();

                }

        });


    });

    //ФИНАНСЫ=--------------------------==================================
   // $('#finances_dataTable').dataTable();
    //убираем год раньше 2012 и позже текущего
   // $('#finance_period_1i option').each(function(){
   //   if ((parseInt($(this).val())<2011)  ||  (parseInt($("select#finance_period_1i").val())<parseInt($(this).val()))) {
    //      $(this).remove();
    //  } ;
   // });




    //селекты в индексе финансов

    $.fn.ajaxindex = function(){
        $.ajax({url: '/partner/finances/ajaxIndex',
            data:
            {
                place_id:$('#place_id_select').val(),
                //date:$('#date_id_select').val(),
                period:$('.current_period').attr('value'),
                status_id: $('#finance_status_id_select').val()
            },
            success:
                function(data){
                    $('table tbody').hide();
                    $('table tbody').html(data);
                    $('table tbody').show();
                    $(this).loading({
                                    action: 'hide'
                              });
                }
        });
    };
    $('#place_id_select').change(function(){
       $(this).ajaxindex();
        $(this).loading({
            action: 'show'
        });
    });

    $('#date_id_select').change(function(){
        $(this).ajaxindex();
    });

    $('#finance_status_id_select').change(function(){
        $(this).ajaxindex();
    });

    $('.cont').css('min-height', $(document).height() - 65 );

    $('.reg').valid({
        text: '.user-name',
        phone: '.user-phone',
        confirmButton: $('.enter'),
        error: 'error',
        success: 'success',
        showError: false,
        funct: function(){

        }
    });
    $('.pass').valid({
        confirmButton: $('.enter-pass'),
        password: '#user-pass',
        repassword: '#user-repass',
        textLength: 2,
        passwordLength: 6,
        error: 'error',
        success: 'success',
        showError: false,
        funct: function(){

        }
    });
 //=================active-deactive
    $('#select-all').click(function(){
        $('.select-box').attr('checked', true);
    });

    $('#select-none').click(function(){
        $('.select-box').attr('checked', false);
    });

    $('#select-rnd').click(function(){
        $('.select-box').each(function(){
            if (Math.random() > 0.5) $(this).attr('checked', true);
            else $(this).attr('checked', false);
        });
    });

    $('#select-inv').click(function(){
        $('.select-box').each(function(){
            if (!$(this).is(':checked')) $(this).attr('checked', true);
            else $(this).attr('checked', false);
        });
    });

    $('#button-select-all').live('click', function(){
        $('.select-box').attr('checked', true);
        $(this).attr('id', 'button-select-none');
        $(this).html('<i class="icon-share"></i>');
    });

    $('#button-select-none').live('click', function(){
        $('.select-box').attr('checked', false);
        $(this).attr('id', 'button-select-all');
        $(this).html('<i class="icon-check"></i>');
    });

    $('#activate-selected').click(function(){
        var ids = [];
        $('.select-box').each(function(){
            if ($(this).is(':checked')) {
                ids.push($(this).attr("data-id"));
            }
        });
        $.ajax({
            url: "/partner/ajax/edit",
            type: "post",
            dataType: "json",
            data: {
                model: $('#model-bar').attr('data-code'),
                field: "active",
                id: ids,
                val: 1
            },
            success: function(resp) {
                if (resp.stat == "ok") {
                    location.reload();
                } else {
                    alert(resp.text);
                }
            }
        });
    });

    $('#deactivate-selected').click(function(){
        var ids = [];
        $('.select-box').each(function(){
            if ($(this).is(':checked')) {
                ids.push($(this).attr("data-id"));
            }
        });
        $.ajax({
            url: "/partner/ajax/edit",
            type: "post",
            dataType: "json",
            data: {
                model: $('#model-bar').attr('data-code'),
                field: "active",
                id: ids,
                val: 0
            },
            success: function(resp) {
                if (resp.stat == "ok") {
                    location.reload();
                } else {
                    alert(resp.text);
                }
            }
        });
    });

    $('#remove-selected').click(function(){
        if (window.confirm('Действительно удалить отмеченные записи?')) {
            var ids = [];
            $('.select-box').each(function(){
                if ($(this).is(':checked')) {
                    ids.push($(this).attr("data-id"));
                }
            });
            $.ajax({
                url: "/partner/ajax/remove",
                type: "post",
                dataType: "json",
                data: {
                    model: $('#model-bar').attr('data-code'),
                    id: ids
                },
                success: function(resp) {
                    if (resp.stat == "ok") {
                        location.reload();
                    } else {
                        alert(resp.text);
                    }
                }
            });
        }
    });
 //===============================
      //orders-new-statuses
     $('#cancel-order').live('click', function(){
         var str=$('#current_url').attr('cur')+'ajaxCancel';
         $(this).loading({
             action: 'show'
         });
         $.ajax({
             url: str,
             type: "POST",
             success: function(data){
                 $(this).loading({
                     action: 'hide'
                 });
                 location.reload();
             }
         });


     });
     //Заказ принят
    $('#adopted_btn').live('click', function(){
        var str=$('#current_url').attr('cur')+'ajaxAdopted';
        $(this).loading({
            action: 'show'
        });
        $.ajax({
            url: str,
            type: "POST",
            success: function(data){
                $(this).loading({
                    action: 'hide'
                });
                //alert('prinyat');
                location.reload();
            }
        });


    });




    $('#recover-order').live('click', function(){
        var str=$('#current_url').attr('cur')+'ajaxRecover';
        $(this).loading({
            action: 'show'
        });
        $.ajax({
            url: str,
            type: "POST",
            success: function(data){
                $(this).loading({
                    action: 'hide'
                });
                location.reload();
            }
        });


    });

    $('#step-back').live('click', function(){
        var str=$('#current_url').attr('cur')+'ajax_roll_back';
        $(this).loading({
            action: 'show'
        });
        $.ajax({
            url: str,
            type: "POST",
            success: function(data){
                $(this).loading({
                    action: 'hide'
                });
                if (data.flag==0) {location.reload()} else
                {location.href='/partner/orders'};
            }
        });


    });
    //======================================
});
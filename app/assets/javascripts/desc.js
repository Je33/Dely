var initChart = function(params) {
    $(params.element).kendoChart({
        theme: "default",
        legend: {
            position: "bottom"
        },
        chartArea: {
            background: "#F5F5F5"
        },
        seriesDefaults: {
            type: "column"
        },
        series: params.series,
        categoryAxis: {
            categories: params.categories
        },
        tooltip: {
            visible: true
        }
    });
};

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
                if(form == 'transfer-report'){
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

$(document).ready(function(){


    function tt(){
        $('#statusupd').operatorOrderStatusUpdate();
    }
    window.setInterval( tt , 1500 );

    var statusVar = {};

    function ordcnt (){
        //var urr_arr = window.location.pathname;
       //console.log(urr_arr);

      // if (window.location.pathname == '/desc/orders' || window.location.pathname == '/desc')
       //{
            $.ajax({
                url: '/ajax/order_count',
                data: {
                    status: 10
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
                            if(cntOld != data.cntAll || cntAllOld != data.cntAll  ){
                                $(this).ajaxIndex();
                            }
                        }

                    }
                }
            });
      // }
    }



        var cntorder = window.setInterval(ordcnt, 1000);




    $('.radio-check-input').find('input:checkbox').click(function(){
        if($(this).attr('checked') == 'checked'){
            $(this).parents('.controls').find('input:text')
                .removeAttr('disabled')
        }else{
            $(this).parents('.controls').find('input:text')
                .attr('disabled', 'disabled')
        }
    });


    $('.telephone-code').mask("(999) 999-9999", {
        submit: $('input[name=commit]'),
        showError: false
    });
    $('.tell').mask("(999) 999-9999", {
        showError: false
    });
    if ($('#orders-graph').get(0)) {
        $(this).loading({
            action: 'show'
        });
        $.ajax({
            url: "/desc/ajax/chart_orders",
            type: "post",
            data: {
                period: "day"
            },
            success: function(resp){
                initChart({
                    element: "#orders-graph",
                    series: resp.series,
                    categories: resp.categories
                });
                $(this).loading({
                    action: 'hide'
                });
            }
        });
    }

    $('#orders-period button').click(function(){
        $(this).loading({
            action: 'show'
        });
        var per = $(this).attr("data-period");
        $('#orders-period button').removeClass("active");
        $(this).addClass("active");
        $.ajax({
            url: "/desc/ajax/chart_orders",
            type: "post",
            dataType: "json",
            data: {
                period: per
            },
            success: function(resp){
                initChart({
                    element: "#orders-graph",
                    series: resp.series,
                    categories: resp.categories
                });
                $(this).loading({
                    action: 'hide'
                });
            }
        });
    });

    if ($('#orders-sums tbody').get(0)) {
        $(this).loading({
            action: 'show'
        });
        $.ajax({
            url: "/desc/ajax/order_sum",
            type: "post",
            data: {
                period: "day"
            },
            success: function(resp){
                $('#orders-sums tbody').html(resp);
                $(this).loading({
                    action: 'hide'
                });
            }
        });
    }

    $('#order-period button').click(function(){
        $(this).loading({
            action: 'show'
        });
        var per = $(this).attr("data-period");
        $('#order-period button').removeClass("active");
        $(this).addClass("active");
        $.ajax({
            url: "/desc/ajax/order_sum",
            type: "post",
            data: {
                period: per
            },
            success: function(resp){
                $('#orders-sums tbody').html(resp);
                $(this).loading({
                    action: 'hide'
                });
            }
        });
    });

    if ($('#pop-sums tbody').get(0)) {
        $(this).loading({
            action: 'show'
        });
        $.ajax({
            url: "/desc/ajax/places_top",
            type: "post",
            data: {
                period: "day"
            },
            success: function(resp){
                $('#pop-sums tbody').html(resp);
                $(this).loading({
                    action: 'hide'
                });
            }
        });
    }

    $('#pop-period button').click(function(){
        $(this).loading({
            action: 'show'
        });
        var per = $(this).attr("data-period");
        $('#pop-period button').removeClass("active");
        $(this).addClass("active");
        $.ajax({
            url: "/desc/ajax/places_top",
            type: "post",
            data: {
                period: per
            },
            success: function(resp){
                $('#pop-sums tbody').html(resp);
                $(this).loading({
                    action: 'hide'
                });
            }
        });
    });

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
            url: "/desc/ajax/edit",
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
            url: "/desc/ajax/edit",

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
                url: "/desc/ajax/remove",
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


  //=====================orders==============================
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
        $.ajax({url: '/desc/orders/sortIndex',
            data:
            {
                ids: ids,
                ops:ops,
                cur_page:cur_page
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
                    $.ajax({url: '/desc/orders/ajaxPaginate',
                        data:
                        {
                            // o_counts:o_counts
                            //ids: ids,
                            //ops:ops,
                            cur_page:cur_page
                            //  offset: $('#orders_offset').attr('value')
                        },
                        success:
                            function(nav){
                                $(this).loading({
                                    action: 'hide'
                                });
                                $('#navigation').hide();
                                $('#navigation').html(nav);
                                $('#navigation').show();
                            }
                    });
                }
        });
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
        $.ajax({url: '/desc/orders/sortIndex',
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
                    $.ajax({url: '/desc/orders/ajaxPaginate',
                        data:
                        {   //ids: ids,
                            //ops:ops,
                            o_counts:o_counts
                            // offset: $('#orders_offset').attr('value')
                        },
                        success:
                            function(nav){
                                $(this).loading({
                                    action: 'hide'
                                });
                                $('#navigation').hide();
                                $('#navigation').html(nav);
                                $('#navigation').show();
                            }
                    });

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


        $.ajax({url: '/desc/orders/sortIndex',
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


                    $.ajax({url: '/desc/orders/ajaxPaginate',
                        data:
                        {
                            cur_page: cur_page
                            //offset: $('#orders_offset').attr('value')
                        },
                        success:
                            function(nav){
                                $(this).loading({
                                    action: 'hide'
                                });
                                $('#navigation').hide();
                                $('#navigation').html(nav);
                                $('#navigation').show();
                            }
                    });
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


        $.ajax({url: '/desc/orders/sortIndex',
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
                    $.ajax({url: '/desc/orders/ajaxPaginate',
                        data:
                        {
                            // ids: ids,
                            // ops:ops,
                            cur_page:parseInt(cur_page, 10)-1
                            //offset: $('#orders_offset').attr('value')
                        },
                        success:
                            function(nav){
                                $(this).loading({
                                    action: 'hide'
                                });
                                $('#navigation').hide();
                                $('#navigation').html(nav);
                                $('#navigation').show();
                            }
                    });

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

        $.ajax({url: '/desc/orders/sortIndex',
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
                    //Навигация
                    $.ajax({url: '/desc/orders/ajaxPaginate',
                        data:
                        {
                            //ids: ids,
                            //ops:ops,
                            cur_page: parseInt(cur_page, 10)+1
                            //offset: $('#orders_offset').attr('value')
                        },
                        success:
                            function(nav){
                                $(this).loading({
                                    action: 'hide'
                                });
                                $('#navigation').hide();
                                $('#navigation').html(nav);
                                $('#navigation').show();
                            }
                    });
                }

        });


    });

    //=========================подтверждения
        $('.close, .closeallmodal, .modal-backdrop').live('click', function(){
            $('.modal').remove();
            $('.modal-backdrop').remove();
        });
        $('body').tottal({
            pos: 'new'
        });

        var opt = {
            status: $('#color span'),
            operatorName : $('#operator-name'),
            buttonConfirm: $('#confirm-order')
        };
        $('#transfer-to-the-restaurant').live('click', function(){
            var min = parseInt($('.min-order').text());
            var cur_order = parseInt($('.tottal-cena-bez-dst').text());
            if (cur_order < min) {
                alert('не хватает ' + (min-cur_order) + ' руб. до минимальной суммы заказа');
            }
            else
            {
                $('#save-change').trigger('click');
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
                            location.reload();
                           // $('#change-order').remove();
                           // $('#transfer-to-the-restaurant').remove();
                           // $('.modal, .modal-backdrop').remove();
                           // $('.new-order').text('Переданно по е-мэйл');
                        }
                    }
                });
            }

        });

        $('#confirm-order').live('click', function(){
            //opt.status.addClass('confirmed-order');
            //opt.status.text('Подтвержденно');
           // opt.operatorName.text($('#operator-name').text());
           // opt.buttonConfirm.removeAttr('id');
           // opt.buttonConfirm.text('Передать в ресторан');
           // opt.buttonConfirm.attr('id', 'transfer-to-the-restaurant');
           // opt.buttonConfirm.removeClass('btn-primary');
           // opt.buttonConfirm.addClass('btn-success');
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
                    location.reload();
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

            $('#address').hide();
            var str=$('#current_url').attr('cur')+'ajaxChangeAddress';
            $.ajax({url: str,
                success:
                    function(data){
                        $('#address').html(data);
                        $('#address').show();
                                  }
                    });

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



    //Сохранить изменения=====================================

        $('#save-change').live('click', function(){
              var min = parseInt($('.min-order').text());
              var cur_order = parseInt($('.tottal-cena-bez-dst').text());
              if (cur_order < min) {
                alert('не хватает ' + (min-cur_order) + ' руб. до минимальной суммы заказа');
                }
                else {

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
                      {'ids[]': params,
                          person:$('#order_person').val(),
                          name :$('#order_name').val(),
                          region: $('#order_region_id').val(),
                          metro: $('#order_metro_id').val(),
                          street: $('#order_street').val(),
                          house: $('#order_house').val(),
                          building: $('#order_building').val(),
                          room: $('#order_room').val(),
                          porch: $('#order_porch').val(),
                          floor: $('#order_floor').val(),
                          intercom: $('#order_intercom').val(),
                          change:$('#order_change').val(),
                          phone: $('#order_phone').val(),
                          description: $('#order_description').val()
                      },
                      function(result){
                          //обработка данных которые вернул сервер
                          location.reload() ;
                      }
                  );
                  $('#change-order').show();
              }
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
                        location.reload();
                        //$('#change-order').remove();
                        //$('#delivered_btn').remove();
                        //$('.alert-success').text('Заказ доставлен');
                        //$('.alert-success').show();
                        //$('#color').find('span').removeClass();
                        //$('#color').find('span').addClass('delivered-order');
                        //$('#color').find('span').text('Доставлен');

                    }
            });

        });

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


    $.fn.ajaxIndex = function(){
        var operators='';
        $(".info-left input:checkbox").each(function() {
        if($(this).attr('checked')!=null && $(this).attr('user_id')!=null){
            operators=operators+','+$(this).attr("user_id");
        };
        });

        $.ajax({url: '/desc/orders/ajaxIndex',
            data:
            {
                place_id:$('#orders_place_id_select').val(),
                region_id:$('#orders_region_id_select').val(),
                status_id: $('.info-left li.active a').attr('status_id'),
                user_ids: operators
            },
            success:
                function(data){
                    $(this).loading({
                        action: 'hide'
                    });
                    statusVar = $('.info-left li.active a').attr('status_id');
                    $('#ajax-list tbody').hide();
                    $('#ajax-list tbody').html(data);
                    $('#ajax-list tbody').show();
                }
        });
    };
    $('#orders_place_id_select').change(function(){
        $(this).loading({
            action: 'show'
        });
        $(this).ajaxIndex();
    });

    $('#orders_region_id_select').change(function(){
        $(this).loading({
            action: 'show'
        });
        $(this).ajaxIndex();
    });

    $('.info-left a').live('click',function(){
        $(this).loading({
            action: 'show'
        });
        $('.info-left li.active').removeClass('active');
        $(this).parents('li').addClass('active');
        $(this).ajaxIndex();

    });


    //=====================orders==============================

    $('#add-select-input').click(function(){
        $('.new-box-delivery-region')
            .last()
            .clone()
            .find('input, select, textarea')
            .each(function(){
                $(this).attr('name', $(this).attr('name').replace(/(.*)\[(\d+)\](\[.*?\])/, function(a, b, c, d){
                    c++;
                    return b + '[' + c + ']' + d;
                }));
            })
            .val('')
            .parents('.new-box-delivery-region')
            .insertBefore($(this))
            .show();
    });

    if ($('input[name="delivery"][value="free"]').get(0)) {
        var city_id = $('#place_city_id').val();
        $.ajax({
            url: "/desc/ajax/get_regions",
            type: "post",
            dataType: "json",
            data: {city: city_id},
            success: function(resp) {
                if (resp.stat == "ok") {
                    $('.select-delivery-region').each(function(){
                        $(this).html('');
                        for (var i in resp.regions) {
                            $(this).append('<option value="' + resp.regions[i].id + '">' + resp.regions[i].name + '</option>')
                        }
                    })
                }
            }
        })
    }

    $('.button-delivery-region-del').click(function(){
        $(this).parents('.edit-box-delivery-region').remove();
    });

    $('#reset-password-button').click(function(){
        if (window.confirm("Действительно сбросить пароль?")) {
            var uid = $(this).attr("data-id");
            var th = $(this);
            if (uid > 0) {
                th.attr("disabled", "disabled");
                $('body').loading({
                    action: 'show'
                });
                $.ajax({
                    url: "/desc/ajax/reset_password.json",
                    type: "POST",
                    dataType: 'json',
                    data: { uid: uid },
                    success: function(data) {
                        $('body').loading({
                            action: 'hide'
                        });
                        if (data.stat == "ok") {
                            $("#reset-info").text("Новый пароль выслан пользователю sms сообщением");
                            th.attr("disabled", "disabled");
                        } else {
                            $('#reset-info').text("При отправле sms сообщения возникли ошибки");
                            th.removeAttr("disabled");
                        }
                    }
                })
            }
        }
    });

 //=========================Редактирование ФИНАНСОВ========================
    $('.finance-edit-btn').live('click',function(){
        $('.order_price_td').each(function() {
           var price=parseInt($(this).text());
           $(this).text('');
           $(this).append('<input type="text" id="order_new_price" style="width: 50px !important; text-align: left;" value="'+ price+'">');
        });

        $('.finance-edit-btn').text('Сохранить');
        $('.finance-edit-btn').addClass('finance-save-btn');
        $('.finance-edit-btn').removeClass('finance-edit-btn');
    });

    $('.finance-save-btn').live('click',function(){
        var mas=[];
        $('.order_price_td').each(function() {
            mas.push([$(this).attr('order_id'),$(this).find('input#order_new_price').val()]);

        });
        $('body').loading({
            action: 'show'
        });
        $.ajax({
            url: "/desc/ajax/edit_finance",
            type: "POST",
            data:
            {
            mas: mas,
            id: $('#finance_id').text()
            },
            success: function(data) {
                $('body').loading({
                    action: 'hide'
                });
                location.reload();
            }
        });
        $('.finance-save-btn').text('Редатировать отчет');
        $('.finance-save-btn').addClass('finance-edit-btn');
        $('.finance-save-btn').removeClass('finance-save-btn');

    });
 //========================================================================


 //AJAX-отправка отчета партнеру
    $('.finance-send-btn').live('click',function(){
        $('body').loading({
            action: 'show'
        });
        $.ajax({
            url: "/desc/finances/" + $('#finance_id').text() + "/send_report",
            type: "POST",
            success: function(data) {
                ////console.log(data);
                if (data.phone==0)  {

                    $.ajax({
                        url: "/desc/finances/" + $('#finance_id').text() + "/send_called_report",
                        type: "POST",
                        success: function(data) {

                            location.reload();
                        }
                    });

                }
                   else
                {
                    form('transfer-report', data.phone);



                }

                $('body').loading({
                    action: 'hide'
                });

            }
        });


    });
 //=============================


  //=====================Статистика финансов
    //селекты в индексе финансов

    $.fn.ajaxindex = function(){
        $.ajax({url: '/desc/finances/ajaxIndex',
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


    $('#date_select_desc').change(function(){
        $('body').loading({
            action: 'show'
        });
        $.ajax({url: '/desc/ajax/finance_index',
            data:
            {
                period:$('#date_select_desc').val()

            },
            success:
                function(data){
                    $('body').loading({
                        action: 'hide'
                    });

                    $('tr.need-call td.cnt').text(data["need-call"]);
                    $('tr.send td.cnt').text(data["send"]);
                    $('tr.pay-in td.cnt').text(data["pay-in"]);
                    $('tr.ordered td.cnt').text(data["ordered"]);
                    $('tr.not-ordered td.cnt').text(data["not-ordered"]);

                    $('tr.need-call td.price').text(data["need-call-price"]+ ' руб.');
                    $('tr.send td.price').text(data["send-price"]+ ' руб.');
                    $('tr.pay-in td.price').text(data["pay-in-price"]+ ' руб.');
                    $('tr.ordered td.price').text(data["ordered-price"]+ ' руб.');
                    $('tr.not-ordered td.price').text(data["not-ordered-price"]+ ' руб.');
                }
        });
    });
  //========================================

  //=================ORDERS-NEW-BUTTONS_AND_STATUSES============================================

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
                {location.href='/desc/orders'};
            }
        });


    });
    //============================================================================================
    //menu list
    $('.dropdown-toggle').dropdown();
    //Добавить юзера(создать) НОВЫЙ ПАРТНЕР
    $('.r-box-user').each(function(){
        var b = $(this);
        $('.r-box-user').find('input:radio').click(function(){
            $('.r-box-user').find('input:not(:radio)')
                .attr('disabled','disabled');
            $('.r-box-user').find('select')
                .attr('disabled','disabled');
            $(this).parents('.r-box-user')
                .find('input:not(:radio)')
                .removeAttr('disabled');
            $(this).parents('.r-box-user')
                .find('select')
                .removeAttr('disabled');
        });
    });
    //===================================


    // ================= desc users =================== //

    $("#user-access-select").change(function(){
        if ($(this).val() == 1 || $(this).val() == 2) {
            $.ajax({
                url: "/desc/ajax/get_partners",
                type: "post",
                dataType: "json",
                success: function(resp) {
                    if (resp) {
                        var sv = false;
                        $("#user-partners-select .controls select").html("");
                        for (var i in resp) {
                            if (i == 0) sv = resp[i].id;
                            $("#user-partners-select .controls select").append('<option value="' + resp[i].id + '">' + resp[i].name + '</option>');
                        }
                        $("#user-partners-select").show();
                        if (sv > 0) {
                            $.ajax({
                                url: "/desc/ajax/get_places",
                                type: "post",
                                dataType: "json",
                                data: {partner: sv},
                                success: function(resp) {
                                    if (resp) {
                                        var sv = false;
                                        $("#user-places-select .controls select").html("");
                                        for (var i in resp) {
                                            if (i == 0) sv = resp[i].id;
                                            $("#user-places-select .controls select").append('<option value="' + resp[i].id + '">' + resp[i].name + '</option>');
                                        }
                                        $("#user-places-select").show();
                                    }
                                }
                            });
                        }
                    }
                }
            });
        } else {
            $("#user-partners-select").val(0).hide();
            $("#user-places-select").val(0).hide();
        }
    });

    $("#user-partners-select .controls select").change(function(){
        var sv = $(this).val();
        if (sv > 0) {
            $.ajax({
                url: "/desc/ajax/get_places",
                type: "post",
                dataType: "json",
                data: {partner: sv},
                success: function(resp) {
                    if (resp) {
                        var sv = false;
                        $("#user-places-select .controls select").html("");
                        for (var i in resp) {
                            if (i == 0) sv = resp[i].id;
                            $("#user-places-select .controls select").append('<option value="' + resp[i].id + '">' + resp[i].name + '</option>');
                        }
                        $("#user-places-select").show();
                    }
                }
            });
        }
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


    //Вся история
    //OPTIONS
    $('.link-history').live('click', function(){
        $.ajax({url: '/desc/ajax/ajaxhistory',
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
                   // $('.link-users').parent().removeClass('active');
                   // $('.link-alerts').parent().removeClass('active');
                   // $('.link-history').parent().addClass('active');
                    $('.accordion').show();
                    $('#operatos_logs').show();
                    $('#operatos_logs').removeAttr('user_id');
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
        $.ajax({url: '/desc/ajax/ajaxhistory',
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

});

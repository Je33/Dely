var initChart = function(params) {
    var chart;
    chart = new Highcharts.Chart({
        chart: {
            renderTo: params.element,
            type: params.type
        },
        title: {text: ''},
        subtitle: {text: ''},
        xAxis: {categories: params.categories},
        yAxis: {
            min: 0,
            title: {text: ''}
        },
        legend: {
            layout: 'vertical',
            backgroundColor: '#FFFFFF',
            align: 'left',
            verticalAlign: 'top',
            x: 10,
            y: 10,
            floating: true,
            shadow: true
        },
        tooltip: {
            formatter: function() {
                return '' + this.x + ': ' + this.y + '';
            }
        },
        series: params.series
    });
};

$(document).ready(function(){

    var hr;
    if (location.href.indexOf('partner') > 0) hr = 'partner';
    if (location.href.indexOf('desc') > 0) hr = 'desc';

    var date_start = $("#date-btns .active").attr('data-start');
    var date_end = $("#date-btns .active").attr('data-end');
    var place_id = $("#place-select").val();

    function startChange() {
        var startDate = start.value();

        if (startDate) {
            startDate = new Date(startDate);
            startDate.setDate(startDate.getDate() + 1);
            end.min(startDate);
            if ($("#date-to").val()) {
                $('#date-btns .btn').removeClass('active');
                date_start = startDate.getTime();
                var tmp = new Date($("#date-to").val());
                date_end = tmp.getTime();
                place_id = $("#place-select").val();
                initCharts();
            }
        }
    }

    function endChange() {
        var endDate = end.value();

        if (endDate) {
            endDate = new Date(endDate);
            endDate.setDate(endDate.getDate() - 1);
            start.max(endDate);
            if ($("#date-from").val()) {
                $('#date-btns .btn').removeClass('active');
                date_end = endDate.getTime();
                var tmp = new Date($("#date-from").val());
                date_start = tmp.getTime();
                place_id = $("#place-select").val();
                initCharts();
            }
        }
    }
    if($("#date-from").get(0)){
        var start = $("#date-from").kendoDatePicker({
            change: startChange
        }).data("kendoDatePicker");

        var end = $("#date-to").kendoDatePicker({
            change: endChange
        }).data("kendoDatePicker");

        start.max(end.value());
        end.min(start.value());
    }

    $('#date-btns .btn').click(function(){
        $("#date-from").val('');
        $("#date-to").val('');
        $('#date-btns .btn').removeClass('active');
        $(this).addClass('active');
        date_start = $("#date-btns .active").attr('data-start');
        date_end = $("#date-btns .active").attr('data-end');
        place_id = $("#place-select").val();
        initCharts();
    });

    $("#place-select").change(function(){
        date_start = $("#date-btns .active").attr('data-start');
        date_end = $("#date-btns .active").attr('data-end');
        place_id = $("#place-select").val();
        initCharts();
    });

    var initCharts = function() {

        var prms = {
            start: date_start,
            end: date_end,
            place: place_id
        };

        // index

        if ($("#stat-orders-graph").get(0)) {
            $(this).loading({action: 'show'});
            $.ajax({
                url: "/" + hr + "/ajax/get_stat_orders",
                type: "post",
                dataType: "json",
                data: prms,
                success: function(resp){
                    initChart({
                        element: "stat-orders-graph",
                        series: resp.series,
                        categories: resp.categories,
                        type: 'column'
                    });
                    $(this).loading({action: 'hide'});
                }
            });
        }

        if ($("#stat-orders-cost").get(0)) {
            $(this).loading({action: 'show'});
            $.ajax({
                url: "/" + hr + "/ajax/get_stat_orders_cost",
                type: "post",
                dataType: "json",
                data: prms,
                success: function(resp){
                    initChart({
                        element: "stat-orders-cost",
                        series: resp.series,
                        categories: resp.categories,
                        type: 'column'
                    });
                    $(this).loading({action: 'hide'});
                }
            });
        }

        if ($("#stat-pop-items").get(0)) {
            $(this).loading({action: 'show'});
            $.ajax({
                url: "/" + hr + "/ajax/get_stat_pop_items",
                type: "post",
                dataType: "json",
                data: prms,
                success: function(resp){
                    if (resp) {
                        $("#stat-pop-items tbody").html('');
                        for (var i in resp) {
                            $("#stat-pop-items tbody").append('<tr><td>' + resp[i].name + '</td><td>' + resp[i].c + '</td><td>' + resp[i].pr + ' руб.</td></tr>');
                        }
                    }
                    $(this).loading({action: 'hide'});
                }
            });
        }

        if ($("#stat-orders-rating").get(0)) {
            $(this).loading({action: 'show'});
            $.ajax({
                url: "/" + hr + "/ajax/get_stat_orders_rating",
                type: "post",
                dataType: "json",
                data: prms,
                success: function(resp){
                    initChart({
                        element: "stat-orders-rating",
                        series: resp.series,
                        categories: resp.categories,
                        type: 'column'
                    });
                    $(this).loading({action: 'hide'});
                }
            });
        }

        if ($("#stat-ord-rate").get(0)) {
            $(this).loading({action: 'show'});
            $.ajax({
                url: "/" + hr + "/ajax/get_stat_ord_rate",
                type: "post",
                dataType: "json",
                data: prms,
                success: function(resp){
                    var chart;
                    chart = new Highcharts.Chart({
                        chart: {
                            renderTo: 'stat-ord-rate',
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            formatter: function() {
                                return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    color: '#000000',
                                    connectorColor: '#000000',
                                    formatter: function() {
                                        return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                                    }
                                }
                            }
                        },
                        series: resp
                    });
                    $(this).loading({action: 'hide'});
                }
            });
        }

        if ($("#stat-orders-statuses").get(0)) {
            $(this).loading({action: 'show'});
            $.ajax({
                url: "/" + hr + "/ajax/get_stat_orders_statuses",
                type: "post",
                data: prms,
                success: function(resp){
                    if (resp) {
                        $("#stat-orders-statuses tbody").html('');
                        for (var i in resp) {
                            $("#stat-orders-statuses tbody").append('<tr><td>' + resp[i].status + '</td><td>' + resp[i].cnt + '</td><td>' + resp[i].percent + '%</td></tr>');
                        }
                    }
                    $(this).loading({action: 'hide'});
                }
            });
        }

        if ($("#stat-orders-hours").get(0)) {
            $(this).loading({action: 'show'});
            $.ajax({
                url: "/" + hr + "/ajax/get_stat_orders_hours",
                type: "post",
                dataType: "json",
                data: prms,
                success: function(resp){
                    initChart({
                        element: "stat-orders-hours",
                        series: resp,
                        categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                        type: 'column'
                    });
                    $(this).loading({action: 'hide'});
                }
            });
        }

        if ($("#stat-regions").get(0)) {
            $(this).loading({action: 'show'});
            $.ajax({
                url: "/" + hr + "/ajax/get_stat_regions",
                type: "post",
                dataType: "json",
                data: prms,
                success: function(resp){
                    var chart;
                    chart = new Highcharts.Chart({
                        chart: {
                            renderTo: 'stat-regions',
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            formatter: function() {
                                return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    color: '#000000',
                                    connectorColor: '#000000',
                                    formatter: function() {
                                        return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
                                    }
                                }
                            }
                        },
                        series: resp
                    });
                    $(this).loading({action: 'hide'});
                }
            });
        }

        // details

        if ($("#stat-pop-items-show").get(0)) {
            $(this).loading({action: 'show'});
            $.ajax({
                url: "/" + hr + "/ajax/get_stat_pop_items",
                type: "post",
                dataType: "json",
                data: prms,
                success: function(resp){
                    if (resp) {
                        $("#stat-pop-items-show tbody").html('');
                        for (var i in resp) {
                            $("#stat-pop-items-show tbody").append('<tr><td>' + resp[i].name + '</td><td>' + resp[i].section_name + '</td><td>' + resp[i].price + '</td><td>' + resp[i].c + '</td><td>' + resp[i].pr + ' руб.</td></tr>');
                        }
                    }
                    $(this).loading({action: 'hide'});
                }
            });
        }

    };

    initCharts();

});


/*
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
 categories: params.categories,
 labels: {
 rotation: -90
 }
 },
 tooltip: {
 visible: true
 }
 });
 };

 $(document).ready(function(){

 if ($('.tabbable').get(0)) {
 $('.tabbable').tabs();
 }

 //desc - index
 function startChange() {
 var startDate = start.value();

 if (startDate) {
 startDate = new Date(startDate);
 startDate.setDate(startDate.getDate() + 1);
 end.min(startDate);
 if ($("#date-to").val()) {
 $('#date-btns .btn').removeClass('active');
 date_start = startDate.getTime();
 var tmp = new Date($("#date-to").val());
 date_end = tmp.getTime();
 place_id = $("#place-select").val();
 initCharts();
 }
 }
 }

 function endChange() {
 var endDate = end.value();

 if (endDate) {
 endDate = new Date(endDate);
 endDate.setDate(endDate.getDate() - 1);
 start.max(endDate);
 if ($("#date-from").val()) {
 $('#date-btns .btn').removeClass('active');
 date_end = endDate.getTime();
 var tmp = new Date($("#date-from").val());
 date_start = tmp.getTime();
 place_id = $("#place-select").val();
 initCharts();
 }
 }
 }
 if($("#date-from").get(0)){
 var start = $("#date-from").kendoDatePicker({
 change: startChange
 }).data("kendoDatePicker");

 var end = $("#date-to").kendoDatePicker({
 change: endChange
 }).data("kendoDatePicker");

 start.max(end.value());
 end.min(start.value());
 }

 $('#date-btns .btn').click(function(){
 $("#date-from").val('');
 $("#date-to").val('');
 $('#date-btns .btn').removeClass('active');
 $(this).addClass('active');
 date_start = $("#date-btns .active").attr('data-start');
 date_end = $("#date-btns .active").attr('data-end');
 place_id = $("#place-select").val();
 initCharts();
 });

 $("#place-select").change(function(){
 date_start = $("#date-btns .active").attr('data-start');
 date_end = $("#date-btns .active").attr('data-end');
 place_id = $("#place-select").val();
 initCharts();
 });

 var initCharts = function() {
 var start = date_start,
 end = date_end,
 place = place_id;

 if ($("#stat-orders-graph").get(0)) {
 $(this).loading({
 action: 'show'
 });
 $.ajax({
 url: "/desc/ajax/get_stat_orders",
 type: "post",
 data: {
 start: start,
 end: end,
 place: place
 },
 success: function(resp){
 initChart({
 element: "#stat-orders-graph",
 series: resp.series,
 categories: resp.categories
 });
 $(this).loading({
 action: 'hide'
 });
 },
 completed: function(){

 }
 });
 }

 setTimeout(function(){
 if ($("#stat-orders-cost").get(0)) {
 $(this).loading({
 action: 'show'
 });
 $.ajax({
 url: "/desc/ajax/get_stat_orders_cost",
 type: "post",
 data: {
 start: start,
 end: end,
 place: place
 },
 success: function(resp){
 initChart({
 element: "#stat-orders-cost",
 series: resp.series,
 categories: resp.categories
 });
 $(this).loading({
 action: 'hide'
 });
 }
 });
 }
 }, 100);

 setTimeout(function(){
 if ($("#stat-orders-rating").get(0)) {
 $(this).loading({
 action: 'show'
 });
 $.ajax({
 url: "/desc/ajax/get_stat_orders_rating",
 type: "post",
 data: {
 start: start,
 end: end,
 place: place
 },
 success: function(resp){
 $("#stat-orders-rating").kendoChart({
 series: resp.series,
 legend: {
 position: "bottom"
 },
 categoryAxis: {
 categories: resp.categories,
 labels: {
 rotation: -90
 }
 },
 tooltip: {
 visible: true,
 template: " #= value #"
 },
 seriesColors: ["#CC0033", "#339900"]
 });
 $(this).loading({
 action: 'hide'
 });
 }
 });
 }
 }, 200);

 setTimeout(function(){
 if ($("#stat-pop-items").get(0)) {
 $(this).loading({
 action: 'show'
 });
 $.ajax({
 url: "/desc/ajax/get_stat_pop_items",
 type: "post",
 data: {
 start: start,
 end: end,
 place: place
 },
 success: function(resp){
 if (resp) {
 $("#stat-pop-items tbody").html('');
 for (var i in resp) {
 $("#stat-pop-items tbody").append('<tr><td>' + resp[i].name + '</td><td>' + resp[i].c + '</td><td>' + resp[i].pr + ' руб.</td></tr>');
 }
 }
 $(this).loading({
 action: 'hide'
 });
 }
 });
 }
 }, 300);

 setTimeout(function(){
 if ($("#stat-pop-items-show").get(0)) {
 $(this).loading({
 action: 'show'
 });
 $.ajax({
 url: "/desc/ajax/get_stat_pop_items",
 type: "post",
 data: {
 start: start,
 end: end,
 place: place
 },
 success: function(resp){
 if (resp) {
 $("#stat-pop-items-show tbody").html('');
 for (var i in resp) {
 $("#stat-pop-items-show tbody").append('<tr><td>' + resp[i].name + '</td><td>' + resp[i].section_name + '</td><td>' + resp[i].price + ' руб.</td><td>' + resp[i].c + '</td><td>' + resp[i].pr + ' руб.</td></tr>');
 }
 }
 $(this).loading({
 action: 'hide'
 });
 }
 });
 }
 }, 400);

 setTimeout(function(){
 if ($("#stat-ord-rate").get(0)) {
 $(this).loading({
 action: 'show'
 });
 $.ajax({
 url: "/desc/ajax/get_stat_ord_rate",
 type: "post",
 data: {
 start: start,
 end: end,
 place: place
 },
 success: function(resp){
 $("#stat-ord-rate").kendoChart({
 legend: {
 position: "right"
 },
 seriesDefaults: {
 labels: {
 visible: true,
 format: "{0}"
 }
 },
 series: [{
 type: "pie",
 data: resp.series
 }],
 tooltip: {
 visible: true,
 template: " #= category # - #= value #"
 }
 });
 $(this).loading({
 action: 'hide'
 });
 }
 });
 }
 }, 500);

 setTimeout(function(){
 if ($("#stat-orders-statuses").get(0)) {
 $(this).loading({
 action: 'show'
 });
 $.ajax({
 url: "/desc/ajax/get_stat_orders_statuses",
 type: "post",
 data: {
 start: start,
 end: end,
 place: place
 },
 success: function(resp){
 if (resp) {
 $("#stat-orders-statuses tbody").html('');
 for (var i in resp) {
 $("#stat-orders-statuses tbody").append('<tr><td>' + resp[i].status + '</td><td>' + resp[i].cnt + '</td><td>' + resp[i].percent + '%</td></tr>');
 }
 }
 $(this).loading({
 action: 'hide'
 });
 }
 });
 }
 }, 600);

 setTimeout(function(){
 if ($("#stat-orders-hours").get(0)) {
 $(this).loading({
 action: 'show'
 });
 $.ajax({
 url: "/desc/ajax/get_stat_orders_hours",
 type: "post",
 data: {
 start: start,
 end: end,
 place: place
 },
 success: function(resp){
 $("#stat-orders-hours").kendoChart({
 seriesDefaults: {
 type: "line"
 },
 series: [{
 data: resp
 }],
 valueAxis: {
 labels: {
 format: "{0}"
 }
 },
 categoryAxis: {
 categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
 },
 tooltip: {
 visible: true,
 format: "{0}"
 },
 legend: {
 visible: false
 }
 });
 $(this).loading({
 action: 'hide'
 });
 }
 });
 }
 }, 800);

 setTimeout(function(){
 if ($("#stat-orders-check").get(0)) {
 $(this).loading({
 action: 'show'
 });
 $.ajax({
 url: "/desc/ajax/get_stat_orders_check",
 type: "post",
 data: {
 start: start,
 end: end,
 place: place
 },
 success: function(resp){
 $("#stat-orders-check").kendoChart({
 series: [
 {data: [200, 450, 300, 125, 280, 15, 150] }
 ],
 legend: {
 position: "bottom"
 },
 categoryAxis: {
 categories: ['16.03.12', '17.03.12', '18.03.12', '19.03.12', '20.03.12', '21.03.12', '22.03.12']
 },
 tooltip: {
 visible: true,
 template: " #= value #"
 },
 legend: {
 visible: false
 }
 });
 $(this).loading({
 action: 'hide'
 });
 }
 });
 }
 }, 900);

 setTimeout(function(){
 if ($("#stat-regions").get(0)) {
 $(this).loading({
 action: 'show'
 });
 $.ajax({
 url: "/desc/ajax/get_stat_regions",
 type: "post",
 data: {
 start: start,
 end: end,
 place: place
 },
 success: function(resp){
 $("#stat-regions").kendoChart({
 legend: {
 position: "right"
 },
 seriesDefaults: {
 labels: {
 visible: true,
 format: "{0}"
 }
 },
 series: [{
 type: "pie",
 data: resp
 }],
 tooltip: {
 visible: true,
 template: " #= category # - #= value #"
 }
 });
 $(this).loading({
 action: 'hide'
 });
 }
 });
 }
 }, 1000);
 };

 initCharts();





 //desc - inner



 $("#number").kendoChart({
 title: {
 text: "Количество заказов"
 },
 series: [
 {data: [200, 450, 300, 125, 280, 15, 150] }
 ],
 legend: {
 position: "bottom"
 },
 categoryAxis: {
 categories: ['16.03.12', '17.03.12', '18.03.12', '19.03.12', '20.03.12', '21.03.12', '22.03.12']
 },
 tooltip: {
 visible: true,
 template: " #= value #"
 },
 legend: {
 visible: false
 }
 });
 $("#amount").kendoChart({
 title: {
 text: "Сумма заказов в рублях"
 },
 series: [
 {data: [1231, 1546, 1237, 1459, 12345, 7777, 789] }
 ],
 legend: {
 position: "bottom"
 },
 categoryAxis: {
 categories: ['16.03.12', '17.03.12', '18.03.12', '19.03.12', '20.03.12', '21.03.12', '22.03.12']
 },
 tooltip: {
 visible: true,
 template: " #= value #"
 },
 legend: {
 visible: false
 }
 });
 $("#reyting").kendoChart({
 title: {
 text: "Рейтинг заказов"
 },
 series: [{
 name: "Плохие отзывы",
 stack: "bad",
 data: [1, 2, 3, 4, 5, 6, 7]
 }, {
 name: "Хорошие отзывы",
 stack: "good",
 data: [7, 6, 5, 4, 3, 2, 1]
 }],
 legend: {
 position: "bottom"
 },
 categoryAxis: {
 categories: ['16.03.12', '17.03.12', '18.03.12', '19.03.12', '20.03.12', '21.03.12', '22.03.12']
 },
 tooltip: {
 visible: true,
 template: " #= value #"
 },
 seriesColors: ["#CC0033", "#339900"]
 });
 $("#loyalty").kendoChart({
 legend: {
 position: "top"
 },
 seriesDefaults: {
 labels: {
 visible: true,
 format: "{0}"
 }
 },
 series: [{
 type: "pie",
 data: [ {
 category: "Новые заказы",
 value: 500
 }, {
 category: "Повторные заказы",
 value: 1500
 }]
 }],
 tooltip: {
 visible: true,
 template: " #= category # - #= value #"
 }
 });
 $("#status").kendoChart({
 legend: {
 position: "top"
 },
 seriesDefaults: {
 labels: {
 visible: true,
 format: "{0}"
 }
 },
 series: [{
 type: "pie",
 data: [ {
 category: "Отменено",
 value: 15000
 }, {
 category: "Доставлено",
 value: 123123
 }]
 }],
 tooltip: {
 visible: true,
 template: " #= category # - #= value #"
 }
 });
 $("#pie-region-delivery").kendoChart({
 legend: {
 position: "top"
 },
 seriesDefaults: {
 labels: {
 visible: true,
 format: "{0}"
 }
 },
 series: [{
 type: "pie",
 data: [ {
 category: "Центральный",
 value: 500
 }, {
 category: "Советский",
 value: 1500
 }, {
 category: "Ленинский",
 value: 8000
 }, {
 category: "Тракторозаводский",
 value: 5400
 }, {
 category: "ЧМЗ",
 value: 10
 } ]
 }],
 tooltip: {
 visible: true,
 template: " #= category # - #= value #"
 }
 });
 $("#order-to-time").kendoChart({
 title: {
 text: "Заказы по часам"
 },
 seriesDefaults: {
 type: "line"
 },
 series: [{
 data: [ 1, 2, 3, 4, 5, 6, 5, 4, 8, 4, 9, 23 , 5, 6, 56, 33, 34, 34, 45, 12, 21, 33, 44, 55]
 }],
 valueAxis: {
 labels: {
 format: "{0}"
 }
 },
 categoryAxis: {
 categories: [
 '00:00',
 '01:00',
 '02:00',
 '03:00',
 '04:00',
 '05:00',
 '06:00',
 '07:00',
 '08:00',
 '09:00',
 '10:00',
 '11:00',
 '12:00',
 '13:00',
 '14:00',
 '15:00',
 '16:00',
 '17:00',
 '18:00',
 '19:00',
 '20:00',
 '21:00',
 '22:00',
 '23:00'
 ]
 },
 tooltip: {
 visible: true,
 format: "{0}%"
 },
 legend: {
 visible: false
 }
 });
 $("#average-bill").kendoChart({
 title: {
 text: "Средний чек"
 },
 series: [
 {data: [200, 450, 300, 125, 280, 15, 150] }
 ],
 legend: {
 position: "bottom"
 },
 categoryAxis: {
 categories: ['16.03.12', '17.03.12', '18.03.12', '19.03.12', '20.03.12', '21.03.12', '22.03.12']
 },
 tooltip: {
 visible: true,
 template: " #= value #"
 },
 legend: {
 visible: false
 }
 });
 });

 */
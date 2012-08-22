$('#no-transfer').live('click', function(){
    $('.modal').remove();
    $('.modal-backdrop').remove();
});
    //Если оповещаем ресторан по телефону, то вылазит эта форма
   $('#transfered-to-the-restoran').live('click', function(){
       var str=$('#current_url').attr('cur')+'ajaxTransfer';
       $('body').loading({
           action: 'show'
       });
       $.ajax({
           url: str,
           data:{
               trans_type: 'phone'
           },

           success: function(data){
               $('body').loading({
                   action: 'hide'
               });
               location.reload();

           }
     });
   });

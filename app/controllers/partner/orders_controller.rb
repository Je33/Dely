#encoding: utf-8
class Partner::OrdersController < ApplicationController
  #before_filter :partner_admin_operator
  before_filter :admins
  before_filter :global_orders, :title_set, :breds
  layout 'partner'

  def title_set
    @title = "Svek.la {свекла}"
    @descr = "Svek.la {свекла} это новый удобный способ заказывать любимую еду и получать за это подарки."
    @title = "Личный кабинет | " + @title.to_s
  end

  def global_orders
    global_orders = role_orders
  end

 def paginate
    if cookies["seen_pages"]
     @pages= (global_orders.count/cookies["seen_pages"].to_f).ceil
    else
      @pages= (global_orders.count/50.to_f).ceil
    end

  end

  def index
    @title = "Заказы | " + @title
    #@o_cnt=paginate
    #определяем все заказы чувака
    #@prev=0
    #@bred=[]
    #paginate
    session[:orders]= global_orders.count
    #@cur_page=1
    #@orders=role_orders
    #if @pages>1
    #  @next=1
    #else
    #  @next=0
    #end

    #@bred[0]=['Заказов <sup class="order_count">'+session[:orders].to_s+'</sub>', partner_orders_path]

    #@operators=PlaceAccess.where("place_id IN (?)",partner_admin_places_id).all.map{|u| u.user_id}.uniq

    #if cookies["seen_pages"]
      @orders= global_orders.order("id DESC")#.take(cookies["seen_pages"].to_i)
    #else
    #  @orders= global_orders.order("id DESC").take(50)
    #  cookies["seen_pages"] = 50
    #end
    @partner_bred=[]

    @partner_bred[0]=['Заказы',partner_orders_path]
    #@partner_bred[1]=[' / '+@finance.place.name,partner_finances_path(:place_id=>@finance.place.id)]


  end

  def ajaxSorting
    #@orders=role_orders
    @orders=global_orders
    @checked=[]
    @ops=[]
   if params[:ids]
      @checked=params[:ids].split(':')
   end

  if params[:ops]
    @ops=params[:ops].split(':')
  end

    #@bred=[]
    if  @checked.count > 1
      @checked=@checked.drop(1)
      @orders=@orders.where(:status_id => @checked)
    end

    if  @ops.count > 1
      @ops=@ops.drop(1)
      @orders=@orders.where(:manager=>@ops)
    end
    #if params[:o_counts]
    #  @offst=params[:o_counts].to_i
    #  cookies["seen_pages"]=@offst
    #else
    #  if cookies["seen_pages"]
     #   @offst=cookies["seen_pages"].to_i
    #  else
    #    @offst=50
    #  end
   # end
    #session[:offset]= @offst
    #session[:orders]= @orders.count

end

  def sortIndex
    ajaxSorting
    #page=params[:cur_page] ? params[:cur_page].to_i : 1
    @orders= @orders.order("id DESC")#[((page-1)*@offst)..((page-1)*@offst+(@offst-1))]
    render 'sortIndex',:layout=>'nil'
  end

  def ajaxPaginate
    @pages= (session[:orders].to_i/session[:offset].to_f).ceil
    if params[:cur_page]
      @cur_page=params[:cur_page].to_i
    else
      @cur_page=1
    end
     @next= @cur_page<@pages ? (@cur_page+1) : 0
     @prev= @cur_page.to_i>1 ? (@cur_page-1) : 0
     render '_navigation',:layout=>'nil'
  end

  def show
    @title = "Заказ # #{params[:id]} | " + @title
    #@bred=[]
    @order=Order.find(params[:id])
    if @order.status_id.to_i<60 and (current_user.access.to_i==1 or current_user.access.to_i==2)
      redirect_to '/partner/orders'
    else
      if @order.status_id.to_i>=60 and current_user.access.to_i==3
        redirect_to '/partner/orders'
      end



      places_id=partner_admin_places_id
      @baskets= @order.baskets
      @items=@order.items

      @status=@order.status
      @orders=role_orders.map{|o| o.id}.sort
      @next= @orders.last!=@order.id ? @orders[@orders.index(@order.id)+1] : 0
      @prev= @orders.first!=@order.id ? @orders[@orders.index(@order.id)-1] : 0

      #Список товаров
      @new_items=[]
      @new_items[0]=["Выберите блюдо",0]
      if @items!=nil and @items!=[]
        Item.where("id NOT IN (?)",@items).each do |i|
          @new_items<<[i.name,i.id]
        end
      else
        Item.all.each do |i|
          @new_items<<[i.name,i.id]
        end
      end
      breds
      @bred[1]=[@order.name,'#']
    end

    @partner_bred=[]
    @partner_bred[0]=['Заказы',partner_orders_path]
    @partner_bred[1]=[@order.id.to_s,partner_order_path(@order.id)]
  end

  def ajaxAdopted
    order=Order.find(params[:order_id])
    if Order.exists?(:manager=>current_user.id, :status_id=>80)
      Order.where(:manager=>current_user.id, :status_id=>80).each do |o|
        o.update_attributes({
                                :status_id=>70,
                                :manager=>nil
                            })
      end
    end

    #Заказ принят
    if order.status_id>=60 and   order.status_id<=80
      order.status_id=80
      order.save

      if order.phone.to_s != ''
        #по смс
        #mes="Ваш заказ уже готовится! Среднее время доставки: " + order.place.delivery_time.to_s + " мин."
        mes="Ваш заказ уже готовится!"
        LittleSMS.new(SMS_USER, SMS_KEY) do
          message.send(:recipients => order.phone.to_s, :message => mes + " " + SMS_DESCR, :sender => SMS_SENDER)
        end
      end

      if  Log.exists?(:order_id => order.id, :status_id => 80, :user_id => current_user.id)
        Log.where(:order_id => order.id, :status_id => 80, :user_id => current_user.id).delete_all
      end

      Log.create({
                     :order_id => order.id,
                     :status_id => 80,
                     :user_id => current_user.id
                 })
    end

   render :text=> 'Adopted'
  end

  def ajaxAdd
     if params[:add_item_count]
       @item_count=params[:add_item_count]
       @item=Item.find(params[:add_item_id])
       @item_cnt_price=@item.price.to_i*@item_count.to_i
       render 'add_item',@item=>@item,@item_count=>@item_count,@item_cnt_price=>@item_cnt_price,:layout=>'nil'
     else
       render :text=>'nil added item'
     end
  end

  def ajaxRecover
    @order=Order.find(params[:order_id])
    @order.status_id=70
    @order.save
    render :json=>{:flag=> true}
  end


  def ajaxCancel
    @order=Order.find(params[:order_id])
    #подтвердить
    if @order.status_id>=60
      @order.status_id=90
    else
      render :json=>{:flag=> false}
    end
    Log.create({
                   :user_id=>current_user.id,
                   :order_id=>@order.id,
                   :status_id=> @order.status_id
               })
    @order.manager=current_user.id
    @order.save
    render :json=>{:flag=> true}
  end

=begin
  def ajaxTransfer
    @order=Order.find(params[:order_id])
    @places_id=partner_admin_places_id
    @partner= @order.place.partner
    @order.status_id=60
    @order.save

    if params[:trans_type] then

      @order.status_id=61
      #лог
      Log.create({
                     :user_id=>current_user.id,
                     :order_id=>@order.id,
                     :status_id=> 61
                 })
      #лог
      Log.create({
                     :user_id=>current_user.id,
                     :order_id=>@order.id,
                     :status_id=> 60
                 })
      else
        #отправить в ресторан
        phone=false
        if @partner.by_phone!=nil and @partner.by_phone!=''
          phone=true

        else
          if @partner.by_sms!=nil and @partner.by_sms!=''
             #по смс
             #SMS-test==================
            #LittleSMS.new(SMS_USER, SMS_KEY) do
              #msg = message.send(:recipients =>'+79209455504', :message => "New order ")
             # if msg.error?
                mess = {:stat => "error", :text => msg.message}
              #else
                # mess = {:stat => "ok", :phone => user.phone, :msg_text => t(:sms_message_send), :text => t(:sms_message_send)}
              #end
            #end
            #===========================
            @order.status_id=60
          end
          if @partner.by_email!=nil and @partner.by_email!=''
             #на почту
             #=============
               PartnerMailer.new_order(@order,@partner.by_email).deliver

             #============
            @order.status_id=62
          end
                   #лог
          Log.create({
                         :user_id=>current_user.id,
                         :order_id=>@order.id,
                         :status_id=> 60
                     })

        end

    end
    @order.save
    if phone
    render :json=>{:phone=>phone,:phone_num=> @partner.by_phone}
    else
      #render :text=>'Transfered'
      render :json=>{:order=>@order,:partner=>@partner}
    end

  end
=end

 def ajaxDeliver
    #Доставленным заказ делает только суперадмин
    @order=Order.find(params[:order_id])
    @order.status_id=95
    @order.manager=current_user.id
    @order.save

    Log.create({
                   :user_id=>current_user.id,
                   :order_id=>@order.id,
                   :status_id=> 95
               })
    if @order.user_id.to_i!=0 and @order.user
      @order.user.balance =  @order.user.balance+(@order.price.to_f/10).ceil
      @order.user.save
    end
    render :text=>'delivered'
 end


 #def destroy
 #   Log.delete_all(:order_id=>params[:id])
 #   Order.find(params[:id]).destroy
 #   redirect_to '/partner/orders'
 #end

  def ajax_roll_back
    order = Order.find(params[:order_id])
    path = 0
    case order.status_id
      when 80
        order.status_id = 70
        order.manager = 0
        path = 1
      when 60,61,62
        order.status_id = 55
      when 90
        order.status_id = 70
    end
    order.save

    render :json=>{:flag => path}
  end

private

 def operators_places
    flag=false
    @order=Order.find(params[:id])
    if PlaceAccess.exists?(:user_id=>current_user.id,:place_id=>@order.place_id) or Partner.exists?(:user_id=>current_user.id,:place_id=>@order.place_id)
      flag=true
    end
   flag
 end
end

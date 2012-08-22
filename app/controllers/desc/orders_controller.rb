#encoding: utf-8
class Desc::OrdersController < ApplicationController
  before_filter :global_orders
  before_filter :global_operators
  layout 'desc'

  def global_orders
    global_orders=Order.where('status_id > 1')
  end

  def paginate
    #@orders=role_orders

    if cookies["seen_pages"]
      @pages= (global_orders.count/cookies["seen_pages"].to_f).ceil
    else
      @pages= (global_orders.count/50.to_f).ceil
    end

  end

  def index
    #@o_cnt=paginate
    #определяем все заказы чувака
    @prev=0
    @bred=[]
    paginate
    session[:orders]= global_orders.count
    @cur_page=1
    if @pages>1
      @next=1
    else
      @next=0
    end

    #breds
    @operators=PlaceAccess.select("user_id").all.map{|u| u.user_id}.uniq

    if cookies["seen_pages"]
      # @orders= global_orders.sort_by {|o| o.status_id}.take(cookies["seen_pages"].to_i)
      @orders= global_orders.order("id DESC").take(cookies["seen_pages"].to_i)
    else
      #@orders= global_orders.sort_by {|o| o.status_id}.take(50)
      @orders= global_orders.order("id DESC").take(50)
      cookies["seen_pages"] = 50
    end
    @places=[]
    @places<<[(I18n.t 'All places'),0]
    Order.select(:place_id).uniq.map{|d| @places<<[(Place.find(d.place_id).name),(d.place_id)]}

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

    @bred=[]
    if  @checked.count > 1
      @checked=@checked.drop(1)
      @orders=@orders.where(:status_id => @checked)
    end

    if  @ops.count > 1
      @ops=@ops.drop(1)
      @orders=@orders.where(:manager=>@ops)
    end
    #breds
    #@bred[0]=['Заказов('+@orders.count.to_s+')',partner_orders_path]
    if params[:o_counts]
      @offst=params[:o_counts].to_i
      cookies["seen_pages"]=@offst
    else
      if cookies["seen_pages"]
        @offst=cookies["seen_pages"].to_i
      else
        @offst=50
      end
    end
    session[:offset]= @offst
    session[:orders]= @orders.count

  end

  def sortIndex
    ajaxSorting
    page=params[:cur_page] ? params[:cur_page].to_i : 1
    @orders= @orders.order("id DESC") #[((page-1)*@offst)..((page-1)*@offst+(@offst-1))]
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

    #render :json=> {:pages=>@pages,:orders=>  session[:orders],:offs=>  session[:offset]}
  end

  def show
    #@bred=[]
    @order=Order.find(params[:id])
    places_id=Place.all.map{|p| p.id}
    @user= Log.exists?(:order_id=>@order.id,:status_id=>@order.status_id) ? User.find(Log.where(:order_id=>@order.id,:status_id=>@order.status_id).last.user_id) : nil
    @baskets= @order.baskets
    @items=@order.items


    #просматривает только один?
    if Order.exists?(:manager=>current_user.id, :status_id=>30)
      Order.where(:manager=>current_user.id, :status_id=>30).each do |o|
        o.update_attributes({
                                :status_id=>10,
                                :manager=>nil
                            })
      end
    end

    if @order.status_id==10
      @order.status_id=30
      @order.manager=current_user.id
    end

    @status=Status.exists?(:id=>@order.status_id) ? Status.find(@order.status_id) : Status.find('1')
    @orders=role_orders.map{|o| o.id}.sort
    @next= (@orders.last!=@order.id and @orders.index(@order.id)!=nil) ? @orders[@orders.index(@order.id)+1] : 0
    @prev= (@orders.first!=@order.id and @orders.index(@order.id)!=nil) ? @orders[@orders.index(@order.id)-1] : 0


    #Список товаров
    #Активные кухни
    sections_ids=[]
    @order.place.sections.each do |s|
       if s.active==1
          sections_ids<<s.id
       end
    end


    @new_items=[]
    @new_items[0]=["Выберите блюдо",0]
    if @items!=nil and @items!=[]
      Item.where("id NOT IN (?) AND section_id IN (?)",@items,sections_ids).each do |i|
        @new_items<<[i.name,i.id]
      end
    else
      Item.all.each do |i|
        @new_items<<[i.name,i.id]
      end
    end

    # Регионы и метро
    if @order.user
      if @order.user.city_id
         if Metro.exists?(:city_id => @order.user.city_id)
           @metros = []
           @metros = Metro.where(:city_id => @order.user.city_id).map{|m| @metros << [m.name, m.id]}
         end

         if Region.exists?(:city_id => @order.user.city_id)
           @regions = []
           @regions = Region.where(:city_id => @order.user.city_id).map{|m| @regions << [m.name, m.id]}
         end
      end
    end



    @order.save
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
          mes="Ваш заказ #" + order.id.to_s + " уже готовится!" 
          #mes="Ваш заказ уже готовится! Среднее время доставки: " + order.place.delivery_time.to_s + " мин."
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
    item_id=params[:add_item_id]
    @item_count=params[:add_item_count]
    @item=Item.find(params[:add_item_id])
    @item_cnt_price=@item.price.to_i*@item_count.to_i
    #render :json=>{:par=>params,:item=>@item,:item_cnt_price=>@item_cnt_price,:item_count=>@item_count}
    render 'add_item',@item=>@item,@item_count=>@item_count,@item_cnt_price=>@item_cnt_price,:layout=>'nil'
  end

  def ajaxEdit
    #Айдишики ВСЕХ товаров(тут и добавленные, а если удалили , то тут его нет и из базы надо удалить)

    @order=Order.find(params[:order_id])
    @order.update_attributes({
                                 :person => params[:person],
                                 :name => params[:name],
                                 :region_id => params[:region],
                                 :metro_id => params[:metro],
                                 :phone => params[:phone],
                                 :street => params[:street],
                                 :house => params[:house],
                                 :building => params[:building],
                                 :room => params[:room],
                                 :porch => params[:porch],
                                 :floor => params[:floor],
                                 :intercom => params[:intercom],
                                 :change => params[:change],
                                 :description => params[:description]
                             })
    @order.manager=current_user.id
    if  params[:ids]
      ids=[]
      @items_in_order=[]
      params[:ids].each do |i|
        str=i.split(':')
        ids<<[str[0],str[1]]
        @items_in_order<< str[0]
      end
      #Добавляем
      ids.each do |id,cnt|
        if Basket.exists?(:item_id=>id, :order_id=>@order.id)
          Basket.where(:item_id=>id, :order_id=>@order.id).first.update_attributes({:cnt=>cnt})
        else
          Basket.create({
                            :order_id=>@order.id,
                            :item_id=>id,
                            :cnt=>cnt
                        })
        end
      end
      #проверяем на удаление
      Basket.where(:order_id=>@order.id).all.map{|b| b.item_id}.each do |b|
        if  @items_in_order.include?(b.to_s)
        else
          Basket.delete_all(:order_id=>@order.id,:item_id=>b)
        end
      end


      ord = @order
      its = ord.baskets
      prc = 0
      its.each do |b|
        i_p = b.item.price.round
        prc += i_p * b.cnt.to_i
      end
      dprc = ord.place.delivery_price.to_i
      if ord.region_id.to_i > 0
        rgns = ord.place.delivery_prices.to_regions.where(:region_id => ord.region_id.to_i)
        if rgns.exists?
          dprc = rgns.first.price.to_i
        end
      end
      ord.price_base = prc
      ord.price_delivery = dprc
      ord.price = prc + dprc
      ord.save

    else
      #Удалены все товары из заказа
      Basket.delete_all(:order_id=>@order.id)

    end




    render :text=>'saved'
  end

  def ajaxSubmit
    order=Order.find(params[:order_id])
    order.manager=current_user.id
    #подтвердить
    order.status_id=55
    #logs
    Log.create({
                   :user_id=>current_user.id,
                   :order_id=>order.id,
                   :status_id=> 55
               })
    order.save
    render :text=>'saved'
  end

  def ajaxCancel
    @order=Order.find(params[:order_id])
    #подтвердить
    @order.status_id=50
    Log.create({
                   :user_id=>current_user.id,
                   :order_id=>@order.id,
                   :status_id=> 50
               })
    @order.manager=current_user.id
    @order.save
    render :text=>'canceled'
  end

  def ajaxTransfer
    order=Order.find(params[:order_id])
    @places_id=partner_admin_places_id
    partner= order.place.partner

    if params[:trans_type] then
      if partner.by_sms.to_s != ''
        #по смс
        mes="Привет! У вас новый заказ #" + order.id.to_s + ". Войдите в ваш ЛК по адресу http://svek.la/partner, чтобы увидеть заказ."
        LittleSMS.new(SMS_USER, SMS_KEY) do
          message.send(:recipients => partner.by_sms.to_s, :message => mes + " " + SMS_DESCR, :sender => SMS_SENDER)
        end
        #===========================
        order.status_id=60
      end

      if partner.by_email!=nil and partner.by_email!=''
        #на почту
        PartnerMailer.new_order(order,order.place.partner.by_email.to_s).deliver
      end

      #лог
      order.status_id=61
      #лог
      Log.create({
                     :user_id=>current_user.id,
                     :order_id=>order.id,
                     :status_id=> 61
                 })
      #лог
    else
      #отправить в ресторан
      phone=false
      if partner.by_phone!=nil and partner.by_phone!=''
        phone=true

      else
        order.status_id=60
        order.save
        if partner.by_sms.to_s != ''
          #по смс
          mes="Привет! У вас новый заказ #" + order.id.to_s + ". Войдите в ваш ЛК по адресу http://svek.la/partner, чтобы увидеть заказ."
          LittleSMS.new(SMS_USER, SMS_KEY) do
            message.send(:recipients => partner.by_sms.to_s, :message => mes + " " + SMS_DESCR, :sender => SMS_SENDER)
          end
          #===========================
          order.status_id=60
        end

        if partner.by_email!=nil and partner.by_email!=''
          #на почту
          PartnerMailer.new_order(order,order.place.partner.by_email.to_s).deliver
          order.status_id=62
        end
        #лог
        Log.create({
                       :user_id=>current_user.id,
                       :order_id=>order.id,
                       :status_id=> 60
                   })

      end

    end
    order.save
    if phone
      render :json=>{:phone=>phone,:phone_num=> partner.by_phone}
    else
      render :text=>'Transfered'
    end
  end

  def ajaxDeliver
    order=Order.find(params[:order_id])
    order.status_id=100
      #по смс
    if  order.phone.to_s!=''
      #mes="Ваш заказ №" + order.id.to_s + " доставлен :-) Оцените заказ, пожалуйста."
      #mes="Спасибо за использование сервиса доставки Svek.la (Свекла)! Для улучшение качества наших услуг, пожалуйста, оцените ваш последний заказ #" + order.id.to_s + " по ссылке http://m.svek.la/my/order/"+order.id.to_s+"/rate"
      mes="Спасибо за использование сервиса доставки Svek.la (Свекла)! Будем рады видеть вас снова."
      LittleSMS.new(SMS_USER, SMS_KEY) do
        message.send(:recipients => order.phone.to_s, :message => mes + " " + SMS_DESCR, :sender => SMS_SENDER)
      end
    end

    order.manager=current_user.id
    order.save
    Log.create({
                   :user_id=>current_user.id,
                   :order_id=>order.id,
                   :status_id=> 100
               })

    if order.user_id.to_i!=0 and order.user
      order.user.balance=  order.user.balance+(order.price.to_f/10).ceil
      order.user.save
    end
    render :text=>'delivered'
  end

  def ajaxRecover
    @order=Order.find(params[:order_id])
    @order.status_id=10
    @order.save
    render :json=>{:flag=> true}
  end

  def destroy
    Log.delete_all(:order_id=>params[:id])
    Order.find(params[:id]).destroy
    redirect_to '/desc/orders'
  end

  def ajaxIndex

    params[:place_id].to_i!=0 ? @orders=global_orders.where(:place_id=>params[:place_id]).order("id DESC") :  @orders=global_orders.order("id DESC")

    if (params[:status_id].to_i!=0)
      @orders= @orders.where(:status_id=>params[:status_id].split(/,/)).order("id DESC")
    end

    if params[:region_id].to_i!= 0
      @orders=@orders.where(:region_id=>params[:region_id])
      @orders=@orders.where(:region_id=>params[:region_id])
    end

    if params[:user_ids]!='' and params[:user_ids]!=nil
      ids=params[:user_ids].split(/,/).compact
      if ids[0]==''
        ids=ids.drop(1)
      end
      if ids.index('0')==nil
        @orders=@orders.where(:manager=>ids).order("id DESC")
      else
        @orders= @orders.order("id DESC")
      end
    else
    end



    render '_order', :layout=>'nil'
    #render :json=>{:ids=>ids,:index=>ids.index('0')}
    #render :json=>{:orders=>@orders,:global_orders=>global_orders}
  end

  def ajax_roll_back
   order = Order.find(params[:order_id])
   path = 0
   case order.status_id
     when 30
       order.status_id = 10
       order.manager = 0
       path = 1
     when 55
       order.status_id = 30
     when 60,61,62,70
       order.status_id = 55
     when 80
       order.status_id = 70
       order.manager = 0
     when 95
       order.status_id = 80
       order.manager = current_user.id
     when 100
       order.status_id = 95
     when 50,20,90
      if Log.exists?(:order_id=>order.id)
        order.status_id = Log.where(:order_id=>order.id).order("id DESC").first.status_id
      end
   end
  order.save

  render :json=>{:flag => path}
  end

  def ajaxChangeAddress
    @order = Order.find(params[:order_id])
    @metros = []
    @regions = []
    #if @order.user
      if @order.city_id
        if Metro.exists?(:city_id => @order.city_id)
          #@metros = []
          @metros = Metro.where(:city_id => @order.city_id).map{|m| @metros << [m.name, m.id]}
        end

        if Region.exists?(:city_id => @order.city_id)
         # @regions = []
          @regions = Region.where(:city_id => @order.city_id).map{|m| [m.name, m.id]}
        end
      end
    #end
    render '_change_address', :layout => 'nil'
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
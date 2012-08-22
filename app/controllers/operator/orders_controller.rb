#encoding: utf-8
class Operator::OrdersController < ApplicationController
  #before_filter :partner_admin_operator
  layout 'operator'
  def index
    #partner_admin_operator
    #определяем все заказы чувака
    places_id=operator_places_id
    @bred=[]
    @orders=Order.where('place_id IN (?) AND status_id < 100',places_id.uniq)
    @bred[0]=['Заказов('+@orders.count.to_s+')',operator_orders_path]
    #@orders=Order.where(:place_id=>places_id.uniq)
  end

  def show
    places_id=operator_places_id
    @bred=[]
    @order=Order.find(params[:id])
    if !places_id.include?(@order.place_id)
      redirect_to operator_orders_path
    end
    @baskets= @order.baskets
    @items=@order.items
    if @order.user_id > 0
      @user=User.find(@order.user_id)
      @address=@user.addresses.first
    end
    #render :json=>{:addr=>@address}
    @delivery=DeliveryPrice.find_by_place_id(@order.place_id)
    @status=Status.exists?(:id=>@order.status_id) ? Status.find(@order.status_id) : Status.find('50')

    @orders=Order.where('place_id IN (?) AND status_id < 100',places_id.uniq)

    @next=@orders.where("id > ?",@order.id).first ? @orders.where("id > ?",@order.id).first.id : 0

    @prev=@orders.where("id < ?",@order.id).last ? @orders.where("id < ?",@order.id).last.id : 0
    #@next=Order.where("place_id=? AND id!=? AND id>?",@order.place_id,@order.id,@order.id).first ? Order.where("place_id=? AND id!=? AND id>?",@order.place_id,@order.id,@order.id).first.id : 0
    #@prev=Order.where("place_id=? AND id!=? AND id<?",@order.place_id,@order.id,@order.id).last ?  Order.where("place_id=? AND id!=? AND id<?",@order.place_id,@order.id,@order.id).last.id  : 0

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

    #Цена тзаказа
    @order.price=0

    #render :json=>{:items=>@items}
    @items.each do |i|
      # if @baskets.where(:item_id=> i.id)
      @order.price=@order.price+(i.price*@baskets.where(:item_id=> i.id).first.cnt)
      # end
    end
    @order.save
    #Крошки

    @bred[0]=['Заказов('+@orders.count.to_s+')',operator_orders_path]
    #@bred[0]=['Заказов('+Order.where(:place_id=>user_places_id).count.to_s+')',operator_orders_path]
    @bred[1]=[@order.name,'#']

    if @order.status_id<60 or @order.status_id==100
         render '_shownew'
    else
         if @order.status_id==90
            render '_showtrans'
         else
            render '_showsubmit'
         end

    end
  end

  def submit
    @order=Order.find(params[:order_id])
    @order.status_id=60
    #logs
    Log.create({
                   :user_id=>current_user.id,
                   :order_id=>@order.id,
                   :status_id=> @order.status_id
               })
    @order.save
    redirect_to operator_order_path(params[:order_id])
  end

  def transmit
    #передать в ресторан
    @order=Order.find(params[:order_id])
    @order.status_id=90
    #logs
    Log.create({
                   :user_id=>current_user.id,
                   :order_id=>@order.id,
                   :status_id=> @order.status_id
               })
    @order.save
    redirect_to operator_order_path(params[:order_id])

  end


  def cancel_order
    #Отменить зака
    @order=Order.find(params[:order_id])
    if  @order.status_id<70
      @order.update_attributes({
                                   :status_id=>40
                               })
      Log.create({
                     :user_id=>current_user.id,
                     :order_id=>@order.id,
                     :status_id=> @order.status_id
                 })
    end
    redirect_to operator_order_path(params[:order_id])
  end
  def cancel_submit
    #Отменить подтверждение
    @order=Order.find(params[:order_id])
    if  @order.status_id<70
            @order.update_attributes({
            :status_id=>100
          })
          Log.create({
                         :user_id=>current_user.id,
                         :order_id=>@order.id,
                         :status_id=> @order.status_id
                     })
    end
    redirect_to operator_order_path(params[:order_id])
  end
private
  def operator_places_id
    places_id=[]
    if current_user
      #places_id=[]
      if PlaceAccess.exists?(:user_id=>current_user.id,:access=>'2')
        places_id = PlaceAccess.where(:user_id=>current_user.id,:access=>'2').map{|p| p.place_id}
      end
    else
      redirect_to '/'
    end
    places_id
  end
end

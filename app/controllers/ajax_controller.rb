#encoding: utf-8
class AjaxController < ApplicationController
  layout false

  def index
    sql_where = "places.active = 1 AND places.city_id = #{params[:city]}"
    sql_order = "places.id DESC"
    if params[:min_order].to_i > 0
      sql_where += " AND places.min_order <= #{params[:min_order]}"
    end
    if params[:delivery].to_i == 1
      sql_where += " AND places.delivery_price = 0"
    end
    if params[:rating].to_i == 1
      sql_where += " AND places.rating > 0"
    end
    if params[:newest].to_i == 1
      sql_order = 'places.created_at DESC'
    end
    if params[:sorting] == 'rating'
      sql_order = 'places.rating DESC'
    end
    if params[:sorting] == 'delivery_time'
      sql_order = 'places.delivery_time ASC'
    end
    places = Place.where(sql_where)
    if params[:kitchens] && params[:kitchens] != nil
      places = places.joins(:kitchens).where(:kitchens => {:id => params[:kitchens]})
    end
    if params[:special].to_i == 1
      places = places.joins(:specials).where("specials.active" => 1)
    end
    @places = places.joins(:partner).where('partners.active' => 1).group("places.id").order(sql_order)#.limit(10)

  end

  def index_pop
    if params[:type] == "d"
      @top = Item.where(:active => 1, :popular => 1).joins(:section).where("sections.view" => "l")
    else
      @top = Item.where(:active => 1, :popular => 1).joins(:section).where("sections.view" => "g")
    end
  end

  def basket_add
    if params[:id].to_i > 0 && params[:cnt].to_i > 0 && @allow_order
      pr = Item.find(params[:id])
      sc = pr.section
      pl = sc.place
      dt = {
        :place_id => pl.id,
        :status_id => 1,
      }
      if user_signed_in?
        dt[:user_id] = current_user.id
      else
        #if cookies[:last_order]
          # dt[:id] = cookies[:last_order]
        #else
          dt[:sess_id] = session[:session_id]
        #end
      end
      ord = Order.where(dt).first_or_create
      bit = Basket.where({:order_id => ord.id, :item_id => pr.id}).first_or_initialize(:cnt => 0)
      bit.cnt = bit.cnt.to_i + params[:cnt].to_i
      bit.save
      its = ord.baskets
      prc = 0
      its.each do |b|
        i_p = b.item.price.round
        prc += i_p * b.cnt.to_i
      end
      dprc = pl.delivery_price.to_i
      if ord.region_id.to_i > 0
        rgns = pc.delivery_prices.to_regions.where(:region_id => od.region_id.to_i)
        if rgns.exists?
          dprc = rgns.first.price.to_i
        end
      end
      ord.price_base = prc
      ord.price_delivery = dprc
      ord.price = prc + dprc
      ord.save
      if user_signed_in?
        #
      else
        if cookies["last_order"]
          #cookies["last_order"] = {
          #    :value => ord.id.to_s,
          #    :expires => 7.days.from_now,
          #    :path => '/'
          #}
        end
      end
      @ord = ord
      @product = pr
      @place = pl
    end
  end

  def basket_edit
    if params[:id].to_i > 0 and params[:cnt].to_i > 0 && @allow_order
      bsk = Basket.find(params[:id])
      bsk.cnt = params[:cnt].to_i
      bsk.save
      ord = bsk.order
      its = ord.baskets
      plc = ord.place
      prc = 0
      its.each do |b|
        i_p = b.item.price.round
        prc += i_p * b.cnt.to_i
      end
      dprc = plc.delivery_price.to_i
      if ord.region_id.to_i > 0
        rgns = plc.delivery_prices.to_regions.where(:region_id => ord.region_id.to_i)
        if rgns.exists?
          dprc = rgns.first.price.to_i
        end
      end
      ord.price_base = prc
      ord.price_delivery = dprc
      ord.price = prc + dprc
      ord.save
      if prc >= plc.min_order
        render :json => {:id => ord.id, :stat => "ok", :total => prc, :cnt => bsk.cnt, :delivery => dprc, :block => false}
      else
        render :json => {:id => ord.id, :stat => "ok", :total => prc, :cnt => bsk.cnt, :delivery => dprc, :block => true, :dv => plc.min_order - prc}
        #render :json => {:stat => "ins", :total => od.price, :cnt => bs.cnt, :min => pc.min_order, :block => 'true'}
      end
    end
  end

  def basket_del
    if params[:id].to_i > 0 && @allow_order
=begin
      bs = Basket.find(params[:id])
      od = bs.order
      pc = od.place
      it = od.baskets
      pr = 0
      it.each do |i|
        if i.id == params[:id].to_i
          #
        else
          pr += i.item.price.round * i.cnt.to_i
        end
      end
      if pr >= pc.min_order
=end
        bsk = Basket.find(params[:id])
        ord = bsk.order
        plc = ord.place
        bsk.destroy
        its = ord.baskets
        prc = 0
        its.each do |b|
          i_p = b.item.price.round
          prc += i_p * b.cnt.to_i
        end
        dprc = plc.delivery_price.to_i
        if ord.region_id.to_i > 0
          rgns = plc.delivery_prices.to_regions.where(:region_id => ord.region_id.to_i)
          if rgns.exists?
            dprc = rgns.first.price.to_i
          end
        end
        ord.price_base = prc
        ord.price_delivery = dprc
        ord.price = prc + dprc
        ord.save
        if prc.to_i >= plc.min_order.to_i
          render :json => {:id => ord.id, :stat => "ok", :total => prc, :delivery => dprc, :block => false}
        else
          render :json => {:id => ord.id, :stat => "ok", :total => prc, :delivery => dprc, :block => true, :dv => plc.min_order.to_i - prc.to_i}
        end
=begin
      else
        #render :json => {:stat => "ins", :total => od.price, :min => pc.min_order}
        render :json => {:stat => "ok", :total => prc, :delivery => dprc, :min => pc.min_order, :block => true}
      end
=end
    end
  end

  def order_del
    if params[:id] && @allow_order
      order = Order.find(params[:id])
      if order.destroy
        render :json => {:stat => "ok"}
      else
        render :json => {:stat => "error"}
      end
    end
  end

  def baskets_get
    if @allow_order
      if user_signed_in?
        orders = Order.where(:user_id => current_user.id, :status_id => 1)
      else
        orders = Order.where(:sess_id => session[:session_id], :status_id => 1)
      end
      if orders.count > 1
        resp = []
        orders.each do |o|
          resp << {:id => o.id, :text => o.place.name.to_s + " (" + o.price.round.to_s + " р.)"}
        end
        render :json => {:stat => "ok", :type => "list", :orders => resp}
      elsif orders.count == 1
        ord = orders.first
        plc = ord.place
        if plc.min_order.to_i >= ord.price_base.to_i
          render :json => {:stat => "ok", :type => "one", :id => orders.first.id, :block => true}
        else
          render :json => {:stat => "ok", :type => "one", :id => orders.first.id, :block => false, :dv => plc.min_order.to_i - ord.price_base.to_i}
        end
      else
        render :json => {:stat => "error"}
      end
    end
  end

  def basket_get
    if params[:id] && @allow_order
      ord = Order.find(params[:id])
      plc = ord.place
      if ord.price_base < plc.min_order
        render :json => {:stat => "ok", :min => plc.min_order, :block => true, :dv => plc.min_order - ord.price_base}
      else
        render :json => {:stat => "ok", :id => ord.id, :block => false, :dv => plc.min_order - ord.price_base }
      end
    else
      render :json => {:stat => "error"}
    end
  end

  def replay
    if params[:id]
      @order = Order.find(params[:id])
      if @order.user_id.to_i == current_user.id
        if @order.baskets.exists?
          dt = {
              :place_id => @order.place.id,
              :status_id => 1,
              :user_id => current_user.id
          }
          @new_order = Order.create!(dt)
          if @new_order.id.to_i > 0
            @order.baskets.find_each do |b|
              Basket.create!({:order_id => @new_order.id, :item_id => b.item_id, :cnt => b.cnt})
            end
            ord = @new_order
            its = @new_order.baskets
            pl = @new_order.place
            prc = 0
            its.each do |b|
              i_p = b.item.price.round
              prc += i_p * b.cnt.to_i
            end
            dprc = pl.delivery_price.to_i
            if ord.region_id.to_i > 0
              rgns = pc.delivery_prices.to_regions.where(:region_id => od.region_id.to_i)
              if rgns.exists?
                dprc = rgns.first.price.to_i
              end
            end
            ord.price_base = prc
            ord.price_delivery = dprc
            ord.price = prc + dprc
            ord.save
            render :json => {:stat => "ok", :order => ord.id}
          else
            render :json => {:stat => "error"}
          end
        else
          render :json => {:stat => "error"}
        end
      else
        render :json => {:stat => "error"}
      end
    else
      render :json => {:stat => "error"}
    end
  end

  def reset_password
    if User.where(:phone => params[:phone]).exists?
      user = User.where(:phone => params[:phone]).first
      password = 100000 + rand(899999)
      user.password = password
      user.save
      mess = {}
      LittleSMS.new(SMS_USER, SMS_KEY) do
        msg = message.send(:recipients => user.phone.to_s, :message => "Привет! Твой новый пароль: " + password.to_s + ". " + SMS_DESCR, :sender => SMS_SENDER)
        if msg.error?
          mess = {:stat => "error", :text => msg.message}
        else
          mess = {:stat => "ok", :phone => user.phone, :msg_text => t(:sms_message_send), :text => t(:sms_message_send)}
        end
      end
    else
      mess = {:stat => "error", :text => t(:user_not_exist)}
    end
    respond_to do |format|
      format.json { render json: mess }
    end
  end

  def save_address
    if params[:address_id].to_i > 0
      @adr = Address.find(params[:address_id])
      @adr.update_attributes(params[:address])
    else
      @adr = Address.new(params[:address])
    end
    @adr.save
  end

  def get_address
    if params[:id].to_i > 0
      @adr = Address.find(params[:id])
    else
      @adr = Address.new
    end
    @city = City.find(params[:city])
  end

  def del_address
    if params[:id]
      adr = Address.find(params[:id])
      adr.destroy
      render :json => {:stat => "ok"}
    end
  end

  def get_address_json
    if params[:id].to_i > 0
      adr = Address.find(params[:id])
      render :json => adr
    end
  end

  def order_region
    if params[:order].to_i > 0
      @ord = Order.find(params[:order])
      if params[:region].to_i > 0
        @ord.update_attribute(:region_id, params[:region])
        its = @ord.baskets
        pl = @ord.place
        prc = 0
        its.each do |b|
          i_p = b.item.price.round
          prc += i_p * b.cnt.to_i
        end
        dprc = pl.delivery_price.to_i
        if @ord.region_id.to_i > 0
          rgns = pl.delivery_prices.to_regions.where(:region_id => @ord.region_id.to_i)
          if rgns.exists?
            dprc = rgns.first.price.to_i
          end
        end
        @ord.price_base = prc
        @ord.price_delivery = dprc
        @ord.price = prc + dprc
        @ord.save
        render :json => @ord
      else
        @ord.update_attribute(:region_id, 0)
        its = @ord.baskets
        pl = @ord.place
        prc = 0
        its.each do |b|
          i_p = b.item.price.round
          prc += i_p * b.cnt.to_i
        end
        dprc = pl.delivery_price.to_i
        @ord.price_base = prc
        @ord.price_delivery = dprc
        @ord.price = prc + dprc
        @ord.save
        render :json => @ord
      end
    else
      render :json => "error"
    end
  end

  def new_order
    if params[:id].to_i > 0 && @allow_order
      if user_signed_in?
        if Address.where({:street => params[:order][:street]}).exists?
          #
        else
          Address.create!({
              :user_id => current_user.id,
              :name => params[:order][:street],
              :city_id => cookies[:city],
              :region_id => params[:order][:region_id].to_i > 0 ? params[:order][:region_id] : "",
              :metro_id => params[:order][:metro_id].to_i > 0 ? params[:order][:metro_id] : "",
              :street => params[:order][:street],
              :house => params[:order][:house],
              :building => params[:order][:building],
              :porch => params[:order][:porch],
              :floor => params[:order][:floor],
              :room => params[:order][:room],
              :intercom => params[:order][:intercom]
                          })
        end
      end
      order = Order.find(params[:id])
      params[:order][:status_id] = 10
      if order.place && order.place.city_id > 0
        params[:order][:city_id] = order.place.city_id
      end
      params[:order][:created_at] = Time.now
      params[:order][:phone] = "+7 " + params[:order][:phone].to_s
      if !user_signed_in? && User.where({:phone => params[:order][:phone]}).exists?
        us = User.find_by_phone(params[:order][:phone])
        params[:order][:user_id] = us.id
      end
      dprc = order.place.delivery_price.to_i
      if params[:order][:region_id].to_i > 0
        rgns = order.place.delivery_prices.to_regions.where(:region_id => params[:order][:region_id].to_i)
        if rgns.exists?
          dprc = rgns.first.price.to_i
        end
      end
      its = order.baskets
      prc = 0
      its.each do |b|
        i_p = b.item.price.round
        prc += i_p * b.cnt.to_i
      end
      params[:order][:price_base] = prc
      params[:order][:price_delivery] = dprc
      params[:order][:price] = prc + dprc
      if order.update_attributes(params[:order])
        LittleSMS.new(SMS_USER, SMS_KEY) do
          message.send(:recipients => order.phone.to_s, :message => "Ваш заказ ##{order.id} для "+order.place.name+" принят, через несколько минут с вами свяжется оператор для подтверждения. Спасибо!" + " " + SMS_DESCR, :sender => SMS_SENDER)
        end
        render :json => {:stat => "ok", :order => order.id}
      else
        render :json => {:stat => "error"}
      end
    end
  end

  def order_link
    if params[:id] && user_signed_in?
      order = Order.find(params[:id])
      if order.update_attribute(:user_id, current_user.id)
        render :json => {:stat => "ok"}
      else
        render :json => {:stat => "error"}
      end
    end
  end

  def order_cancel
    if params[:id]
      order = Order.find(params[:id])
      order.status_id = 20
      if order.save
        render :json => {:stat => "ok"}
      else
        render :json => {:stat => "error"}
      end
    end
  end

  def order_vote
    if params[:id]
      order = Order.find(params[:id])
      place = order.place
      place.rating = place.rating.to_i + params[:vote].to_i
      if params[:vote].to_i > 0
        place.rating_plus = place.rating_plus.to_i + params[:vote].to_i
      else
        place.rating_minus = place.rating_minus.to_i + params[:vote].to_i
      end
      if place.rating_plus.to_i + place.rating_minus.to_i == 0
        place.rating = 0
      else
        place.rating = ((place.rating_plus.to_f / (place.rating_plus.to_f.abs + place.rating_minus.to_f.abs)) * 100).round
      end
      place.save
      order.rating = params[:vote]
      if order.save
        render :json => {:stat => "ok"}
      else
        render :json => {:stat => "error"}
      end
    end
  end

  def order_gift
    if params[:id]
      gift = Gift.find(params[:id])
      if current_user.balance.to_i >= gift.cost.to_i
        Usergift.create({:user_id => current_user.id, :gift_status_id => 10, :gift_id => gift.id})
        current_user.update_attribute(:balance, current_user.balance.to_i - gift.cost.to_i)
        render :json => {:stat => "ok"}
      else
        render :json => {:stat => "error", :text => "Не хватает баллов"}
      end
    end
  end

  def cancel_gift_order
    if params[:id]
      usergift = Usergift.find(params[:id])
      if usergift.user_id == current_user.id
        current_user.update_attribute(:balance, current_user.balance.to_i + usergift.gift.cost.to_i)
        usergift.destroy
        render :json => {:stat => "ok"}
      else
        render :json => {:stat => "error"}
      end
    end
  end

  def order_count
    if current_user
      if params[:status].to_i > 0
        cnt = role_orders.where(:status_id => params[:status]).count.to_i
        cntAll = role_orders.count.to_i
        render :json => {:cnt => cnt, :cntAll => cntAll}
      end
    else
      render :json => {:cnt=>-1 , :cntALL => -1}
    end
  end


  def  order_count_partner
   #if params[:partner_id]
   #  cntAll=Order.where('place_id IN (?) and status_id >= 60',Place.where(:partner_id=>params[:partner_id]).map{|p| p.id}.uniq).count
   #  cnt= Order.where('place_id IN (?) and status_id IN (60,61,62,70)',Place.where(:partner_id=>params[:partner_id]).map{|p| p.id}.uniq)
   #end
    if current_user
        case current_user.access
            when 1
            #оператор у партнера
              cntALL =  Order.where('place_id in (?) and status_id >=60',current_user.place_accesses.map{|p| p.place_id}).count
              cnt =  Order.where('place_id in (?) and status_id IN (60,61,62,70)',current_user.place_accesses.map{|p| p.place_id}).count
            when 2   #партнер-админ ресторана
            #@orders=[]
            #Получаем партнера
              if Partner.exists?(:user_id=>current_user.id)
                partner_id=current_user.partner.id
              else
                partner_id=current_user.place_accesses.first.place.partner_id
              end
              cntALL = Order.where('place_id IN (?) and status_id >= 60',Place.where(:partner_id=>partner_id).map{|p| p.id}.uniq).count
              cnt =  Order.where('place_id IN (?) and status_id IN (60,61,62,70)',Place.where(:partner_id=>partner_id).map{|p| p.id}.uniq).count
        end
        render :json => {:cnt=>cnt , :cntALL => cntALL}
    else
        render :json => {:cnt=>-1 , :cntALL => -1}
    end
  end

  def order_list
    @orders = role_orders.order("id DESC")
  end

  def order_status
    if params[:order_id]
      render :json => Order.find(params[:order_id]).status_id
    else
      render :text => "epicfail"
    end
  end

end

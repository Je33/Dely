#encoding: utf-8
class Partner::AjaxController < ApplicationController

  #before_filter :global_admins
  layout 'nil'

  def chart_orders
    ser_guest = {:name => "Guest", :data => []}
    ser_auth = {:name => "Auth", :data => []}
    cats = []
    guest_count = 0
    auth_count = 0
    s_d = nil
    if params[:period] == "yesterday"
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.now.beginning_of_day - 1.day, Time.now.end_of_day - 1.day).where(:place_id => partner_admin_places_id).order("created_at ASC")
      if orders.exists?
        s_d = orders.first.created_at.hour
        orders.each do |ord|
          if ord.created_at.hour != s_d
            ser_guest[:data] << guest_count
            ser_auth[:data] << auth_count
            cats << s_d
            guest_count = 0
            auth_count = 0
          end
          if ord.user_id > 0
            auth_count += 1
          else
            guest_count += 1
          end
          s_d = ord.created_at.hour
        end
      end
    end
    if params[:period] == "day"
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.now.beginning_of_day, Time.now.end_of_day).where(:place_id => partner_admin_places_id).order("created_at ASC")
      if orders.exists?
        s_d = orders.first.created_at.hour
        orders.each do |ord|
          if ord.created_at.hour != s_d
            ser_guest[:data] << guest_count
            ser_auth[:data] << auth_count
            cats << s_d
            guest_count = 0
            auth_count = 0
          end
          if ord.user_id > 0
            auth_count += 1
          else
            guest_count += 1
          end
          s_d = ord.created_at.hour
        end
      end
    end
    if params[:period] == "week"
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.now.beginning_of_week, Time.now.end_of_week).where(:place_id => partner_admin_places_id).order("created_at ASC")
      if orders.exists?
        s_d = orders.first.created_at.wday
        orders.each do |ord|
          if ord.created_at.wday != s_d
            ser_guest[:data] << guest_count
            ser_auth[:data] << auth_count
            cats << s_d
            guest_count = 0
            auth_count = 0
          end
          if ord.user_id > 0
            auth_count += 1
          else
            guest_count += 1
          end
          s_d = ord.created_at.wday
        end
      end
    end
    if params[:period] == "month"
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.now.beginning_of_month, Time.now.end_of_month).where(:place_id => partner_admin_places_id).order("created_at ASC")
      if orders.exists?
        s_d = orders.first.created_at.day
        orders.each do |ord|
          if ord.created_at.day != s_d
            ser_guest[:data] << guest_count
            ser_auth[:data] << auth_count
            cats << s_d
            guest_count = 0
            auth_count = 0
          end
          if ord.user_id > 0
            auth_count += 1
          else
            guest_count += 1
          end
          s_d = ord.created_at.day
        end
      end
    end
    if params[:period] == "quarter"
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.now.beginning_of_quarter, Time.now.end_of_quarter).where(:place_id => partner_admin_places_id).order("created_at ASC")
      if orders.exists?
        s_d = orders.first.created_at.day
        orders.each do |ord|
          if ord.created_at.day != s_d
            ser_guest[:data] << guest_count
            ser_auth[:data] << auth_count
            cats << s_d
            guest_count = 0
            auth_count = 0
          end
          if ord.user_id > 0
            auth_count += 1
          else
            guest_count += 1
          end
          s_d = ord.created_at.day
        end
      end
    end
    if params[:period] == "year"
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.now.beginning_of_year, Time.now.end_of_year).where(:place_id => partner_admin_places_id).order("created_at ASC")
      if orders.exists?
        s_d = orders.first.created_at.day
        orders.each do |ord|
          if ord.created_at.day != s_d
            ser_guest[:data] << guest_count
            ser_auth[:data] << auth_count
            cats << s_d
            guest_count = 0
            auth_count = 0
          end
          if ord.user_id > 0
            auth_count += 1
          else
            guest_count += 1
          end
          s_d = ord.created_at.day
        end
      end
    end
    if !cats.include?(s_d)
      ser_guest[:data] << guest_count
      ser_auth[:data] << auth_count
      cats << s_d
    end

    render :json => {
        :series => [ser_guest, ser_auth],
        :categories => cats
    }

    #render :json => orders.map{|o| [o.id, o.user_id, o.created_at.wday, o.created_at.beginning_of_year, o.created_at.end_of_year]}

  end

  def order_sum
    orders = Order.where('status_id > 1').where(:place_id => partner_admin_places_id)
    case params[:period]
      when "yesterday"
        orders = orders.where('created_at > ? AND created_at < ?', Time.now.beginning_of_day - 1.day, Time.now.end_of_day - 1.day)
      when "day"
        orders = orders.where('created_at > ? AND created_at < ?', Time.now.beginning_of_day, Time.now.end_of_day)
      when "week"
        orders = orders.where('created_at > ? AND created_at < ?', Time.now.beginning_of_week, Time.now.end_of_week)
      when "month"
        orders = orders.where('created_at > ? AND created_at < ?', Time.now.beginning_of_month, Time.now.end_of_month)
      when "quarter"
        orders = orders.where('created_at > ? AND created_at < ?', Time.now.beginning_of_quarter, Time.now.end_of_quarter)
      when "year"
        orders = orders.where('created_at > ? AND created_at < ?', Time.now.beginning_of_year, Time.now.end_of_year)
    end
    @ord_delivered = orders.where('status_id = 100')
    @ord_user_cancel = orders.where('status_id = 20')
    @ord_rest_cancel = orders.where('status_id = 80')
  end

  def places_top
    case params[:period]
      when "yesterday"
        @places = Place.select("places.name, SUM(orders.price) AS orders_sum, COUNT(orders.id) as orders_count").joins(:orders).where("orders.status_id = 100").where('orders.created_at >= ? AND orders.created_at <= ?', Time.now.beginning_of_day - 1.day, Time.now.end_of_day - 1.day).group("places.id").order("orders_count DESC, orders_sum DESC")
      when "day"
        @places = Place.select("places.name, SUM(orders.price) AS orders_sum, COUNT(orders.id) as orders_count").joins(:orders).where("orders.status_id = 100").where('orders.created_at >= ? AND orders.created_at <= ?', Time.now.beginning_of_day, Time.now.end_of_day).group("places.id").order("orders_count DESC, orders_sum DESC")
      when "week"
        @places = Place.select("places.name, SUM(orders.price) AS orders_sum, COUNT(orders.id) as orders_count").joins(:orders).where("orders.status_id = 100").where('orders.created_at >= ? AND orders.created_at <= ?', Time.now.beginning_of_week, Time.now.end_of_week).group("places.id").order("orders_count DESC, orders_sum DESC")
      when "month"
        @places = Place.select("places.name, SUM(orders.price) AS orders_sum, COUNT(orders.id) as orders_count").joins(:orders).where("orders.status_id = 100").where('orders.created_at >= ? AND orders.created_at <= ?', Time.now.beginning_of_month, Time.now.end_of_month).group("places.id").order("orders_count DESC, orders_sum DESC")
      when "quarter"
        @places = Place.select("places.name, SUM(orders.price) AS orders_sum, COUNT(orders.id) as orders_count").joins(:orders).where("orders.status_id = 100").where('orders.created_at >= ? AND orders.created_at <= ?', Time.now.beginning_of_quarter, Time.now.end_of_quarter).group("places.id").order("orders_count DESC, orders_sum DESC")
      when "year"
        @places = Place.select("places.name, SUM(orders.price) AS orders_sum, COUNT(orders.id) as orders_count").joins(:orders).where("orders.status_id = 100").where('orders.created_at >= ? AND orders.created_at <= ?', Time.now.beginning_of_year, Time.now.end_of_year).group("places.id").order("orders_count DESC, orders_sum DESC")
    end
  end

  def edit
    if params[:id] && params[:model] && params[:field] && params[:val]
      cl = eval(params[:model])
      res = cl.find(params[:id])
      res.each do |r|
        r.update_attribute params[:field], params[:val]
      end
      render :json => {:stat => "ok"}
    else
      render :json => {:stat => "error", :text => "error"}
    end
  end

  def remove
    if params[:id] && params[:model]
      cl = eval(params[:model])
      res = cl.find(params[:id])
      res.each do |r|
        r.destroy
      end
      render :json => {:stat => "ok"}
    else
      render :json => {:stat => "error", :text => "error"}
    end
  end

  def get_regions
    if params[:city]
      regions = Region.where(:city_id => params[:city])
      render :json => {:stat => "ok", :regions => regions}
    else
      render :json => {:stat => "error"}
    end
  end

  def get_metros
    if params[:city]
      metros = Metro.where(:city_id => params[:city])
      render :json => {:stat => "ok", :regions => metros}
    else
      render :json => {:stat => "error"}
    end
  end

  # statistics

  def get_stat_orders
    if params[:start] && params[:end]
      ser_guest = {:name => "Гости", :data => []}
      ser_auth = {:name => "Пользователи", :data => []}
      cats = []
      guest_count = 0
      auth_count = 0
      s_d = []
      ordr = nil
      if (Time.at(params[:end].to_i) - Time.at(params[:start].to_i)) <= 1.day
        prm = "hour"
        axis = "%H:%M"
      elsif (Time.at(params[:end].to_i) - Time.at(params[:start].to_i)) <= 1.week
        prm = "wday"
        axis = "%d.%m.%y"
      else
        prm = "day"
        axis = "%d.%m.%y"
      end
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.at(params[:start].to_i).strftime('%Y-%m-%d %H:%M:%S'), Time.at(params[:end].to_i).strftime('%Y-%m-%d %H:%M:%S')).order("created_at ASC")
      if params[:place] and params[:place].to_i > 0
        orders = orders.where("place_id = ?", params[:place])
      else
        orders = orders.where(:place_id => partner_admin_places_id)
      end
      if orders.exists?
        orders.each do |ord|
          chk = eval("ord.created_at." + prm)
          if chk != s_d
            ser_guest[:data] << guest_count
            ser_auth[:data] << auth_count
            cats << ord.created_at.strftime(axis)
            guest_count = 0
            auth_count = 0
          end
          if ord.user_id.to_i > 0
            auth_count += 1
          else
            guest_count += 1
          end
          s_d = eval("ord.created_at." + prm)
          ordr = ord
        end
      end
    end
    if cats && !cats.include?(s_d) && ordr
      ser_guest[:data] << guest_count
      ser_auth[:data] << auth_count
      cats << ordr.created_at.strftime(axis)
    end
    render :json => {
        :series => [ser_guest, ser_auth],
        :categories => cats
    }
    #render :json => {:test => prm}
  end

  def get_stat_orders_cost
    if params[:start] and params[:end]
      ser = {:name => "Сумма", :data => []}
      cats = []
      summs = 0
      s_d = []
      ordr = nil
      if (Time.at(params[:end].to_i) - Time.at(params[:start].to_i)) <= 1.day
        prm = "hour"
        axis = "%H:%M"
      elsif (Time.at(params[:end].to_i) - Time.at(params[:start].to_i)) <= 1.week
        prm = "wday"
        axis = "%d.%m.%y"
      else
        prm = "day"
        axis = "%d.%m.%y"
      end
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.at(params[:start].to_i).strftime('%Y-%m-%m %H:%M:%S'), Time.at(params[:end].to_i).strftime('%Y-%m-%m %H:%M:%S')).order("created_at ASC")
      if params[:place] and params[:place].to_i > 0
        orders = orders.where("place_id = ?", params[:place])
      else
        orders = orders.where(:place_id => partner_admin_places_id)
      end
      if orders.exists?
        orders.each do |ord|
          chk = eval("ord.created_at." + prm)
          if chk != s_d
            ser[:data] << summs
            cats << ord.created_at.strftime(axis)
            summs = 0
          else
            summs += ord.price.to_i
          end
          s_d = eval("ord.created_at." + prm)
          ordr = ord
        end
      end
    end
    if cats && !cats.include?(s_d) && ordr
      ser[:data] << summs
      cats << ordr.created_at.strftime(axis)
    end
    render :json => {
        :series => [ser],
        :categories => cats
    }
    #render :json => {:test => prm}
  end

  def get_stat_orders_rating
    if params[:start] and params[:end]
      ser_p = {:name => "Положительные отзывы", :data => []}
      ser_m = {:name => "Отрицательные отзывы", :data => []}
      cats = []
      summ_p = 0
      summ_m = 0
      s_d = []
      ordr = nil
      if (Time.at(params[:end].to_i) - Time.at(params[:start].to_i)) <= 1.day
        prm = "hour"
        axis = "%H:%M"
      elsif (Time.at(params[:end].to_i) - Time.at(params[:start].to_i)) <= 1.week
        prm = "wday"
        axis = "%d.%m.%y"
      else
        prm = "day"
        axis = "%d.%m.%y"
      end
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.at(params[:start].to_i).strftime('%Y-%m-%m %H:%M:%S'), Time.at(params[:end].to_i).strftime('%Y-%m-%m %H:%M:%S')).order("created_at ASC")
      if params[:place] and params[:place].to_i > 0
        orders = orders.where("place_id = ?", params[:place])
      else
        orders = orders.where(:place_id => partner_admin_places_id)
      end
      if orders.exists?
        orders.each do |ord|
          chk = eval("ord.created_at." + prm)
          if chk != s_d
            ser_p[:data] << summ_p
            ser_m[:data] << summ_m
            cats << ord.created_at.strftime(axis)
            summ_p = 0
            summ_m = 0
          else
            if ord.rating.to_i > 0
              summ_p += ord.rating.to_i.abs
            end
            if ord.rating.to_i < 0
              summ_m += ord.rating.to_i.abs
            end
          end
          s_d = eval("ord.created_at." + prm)
          ordr = ord
        end
      end
    end
    if cats && !cats.include?(s_d) && ordr
      ser_p[:data] << summ_p
      ser_m[:data] << summ_m
      cats << ordr.created_at.strftime(axis)
    end
    render :json => {
        :series => [ser_p, ser_m],
        :categories => cats
    }
    #render :json => {:test => prm}
  end

  def get_stat_pop_items
    res = []
    if params[:start] and params[:end]
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.at(params[:start].to_i).strftime('%Y-%m-%m %H:%M:%S'), Time.at(params[:end].to_i).strftime('%Y-%m-%m %H:%M:%S')).order("created_at ASC")
      if params[:place] and params[:place].to_i > 0
        orders = orders.where("place_id = ?", params[:place])
      else
        orders = orders.where(:place_id => partner_admin_places_id)
      end
      if orders.exists?
        res = Basket.find_by_sql("
          SELECT baskets.item_id, items.name, COUNT(*) * baskets.cnt as c, items.price * COUNT(*) * baskets.cnt as pr
          FROM baskets, items
          WHERE order_id in (#{orders.map{|o| o.id}.join(', ')})
          AND baskets.item_id = items.id
          GROUP BY baskets.item_id
          ORDER BY c DESC
          LIMIT 10
        ")
      end
    end
    render :json => res
  end

  def get_stat_ord_rate
    ser_p = {}
    ser_m = {}
    if params[:start] and params[:end]
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.at(params[:start].to_i).strftime('%Y-%m-%m %H:%M:%S'), Time.at(params[:end].to_i).strftime('%Y-%m-%m %H:%M:%S')).order("created_at ASC")
      if params[:place] and params[:place].to_i > 0
        orders = orders.where("place_id = ?", params[:place])
      else
        orders = orders.where(:place_id => partner_admin_places_id)
      end
      ser_p = ["Новые заказы", orders.where("user_id = 0").count]
      ser_m = ["Постоянные клиенты", orders.where("user_id > 0").count]
    end
    render :json => [{
        :type => "pie",
        :data => [ser_p, ser_m]
    }]
  end

  def get_stat_orders_statuses
    out = []
    if params[:start] and params[:end]
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.at(params[:start].to_i).strftime('%Y-%m-%m %H:%M:%S'), Time.at(params[:end].to_i).strftime('%Y-%m-%m %H:%M:%S')).order("created_at ASC")
      if params[:place] and params[:place].to_i > 0
        orders = orders.where("place_id = ?", params[:place])
      else
        orders = orders.where(:place_id => partner_admin_places_id)
      end
      c = orders.count
      cd = orders.where("status_id = 100").count
      cc = orders.where("status_id = 50 OR status_id = 90").count
      cuc = orders.where("status_id = 20").count
      coc = orders.where("status_id != 100 AND status_id != 90 AND status_id != 50 AND status_id != 20").count
      out << {:status => "Доставлен", :cnt => cd, :percent => c > 0 ? ((100 / c) * cd) : 0}
      out << {:status => "Отменен", :cnt => cc, :percent => c > 0 ? ((100 / c) * cc) : 0}
      out << {:status => "Клиент отказался", :cnt => cuc, :percent => c > 0 ? ((100 / c) * cuc) : 0}
      out << {:status => "Другие", :cnt => coc, :percent => c > 0 ? ((100 / c) * coc) : 0}
    end
    render :json => out
  end

  def get_stat_orders_hours
    out = [0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0]
    if params[:start] && params[:end]
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.at(params[:start].to_i).strftime('%Y-%m-%m %H:%M:%S'), Time.at(params[:end].to_i).strftime('%Y-%m-%m %H:%M:%S')).order("created_at ASC")
      if params[:place] && params[:place].to_i > 0
        orders = orders.where("place_id = ?", params[:place])
      else
        orders = orders.where(:place_id => partner_admin_places_id)
      end
      orders.find_each do |o|
        out[o.created_at.hour.to_i] += 1
      end
    end
    render :json => [{:name => "Заказы", :data => out}]
  end

  def get_stat_orders_check
    res = []
    if params[:start] && params[:end]
      res = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.at(params[:start].to_i).strftime('%Y-%m-%m %H:%M:%S'), Time.at(params[:end].to_i).strftime('%Y-%m-%m %H:%M:%S')).order("created_at ASC")
      if params[:place] && params[:place].to_i > 0
        res = res.where("place_id = ?", params[:place])
      else
        res = res.where(:place_id => partner_admin_places_id)
      end
    end
    render :json => res
  end

  def get_stat_regions
    res = []
    if params[:start] && params[:end]
      orders = Order.where("status_id > ? AND created_at >= ? AND created_at <= ?", 1, Time.at(params[:start].to_i).strftime('%Y-%m-%m %H:%M:%S'), Time.at(params[:end].to_i).strftime('%Y-%m-%m %H:%M:%S')).order("created_at ASC")
      if params[:place] && params[:place].to_i > 0
        orders = orders.where("place_id = ?", params[:place])
      else
        orders = orders.where(:place_id => partner_admin_places_id)
      end
      Region.find_each do |r|
        ords = orders.where("region_id = ?", r.id)
        if ords.exists?
          res << [r.name, ords.count]
        end
      end
    end
    render :json => [{
        :type => 'pie',
        :data => res
    }]
  end

end
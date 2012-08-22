# encoding: utf-8
class IndexController < ApplicationController

  before_filter :cookie_set, :check_order, :descr_set

  def cookie_set
    if City.exists?
      if cookies[:city].to_i > 0
        @city = City.find(cookies[:city].to_i)
      else
        @city = City.first
        cookies["city"] = {
            :value => @city.id,
            :expires => 7.days.from_now,
            :path => '/'
        }
      end
      if @city != nil
        if @city.name_dec.nil? || @city.name_title.nil? || @city.name_dec.empty? || @city.name_title.empty?
          inflections = YandexInflect.inflections(@city.name.to_s)
          @city.update_attributes({:name_dec => inflections[5], :name_title => inflections[3]})
        end
        @cities = City.where("id != ?", @city.id)
        if user_signed_in? && current_user.city_id != @city.id
          current_user.update_attribute(:city_id, @city.id)
        end
      end
    end
  end

  def check_order
    if session[:session_id]
      ord_p = {:status_id => 1}
      if user_signed_in?
        ord_p[:user_id] = current_user.id
      else
        #if cookies[:last_order]
        #  ord_p[:id] = cookies[:last_order]
        #else
          ord_p[:sess_id] = session[:session_id]
        #end
      end
      @uorders = Order.where(ord_p)
    end
  end

  def descr_set
    @descr = "Svek.la {свекла} это новый удобный способ заказывать любимую еду из ресторанов в #{@city[:name_dec]} и получать за это подарки."
  end

  def not_found
    @title = "404 | " + @title
  end

  def index
    @title = @title + " — единая служба доставки еды и цветов в Челябинске"
    #@title = @title + " — единая служба доставки еды и цветов в " + @city[:name_title]
    #Finance.cron_finance
    if Place.exists?
      @specials = Special.activated.joins(:item).where("items.active" => 1).joins(:section).where("sections.active" => 1).joins(:place).where("places.active" => 1).joins(:partner).where("partners.active" => 1).shuffle
      @top = Item.where(:active => 1, :popular => 1).joins(:section).where("sections.active" => 1).joins(:place).where("places.active" => 1).joins(:partner).where("partners.active" => 1).shuffle
      @populars = Popular.all
      @kitchens = Kitchen.activated
      sql_where = "places.active = 1"
      if cookies[:city]
        sql_where += " AND places.city_id = #{cookies[:city]}"
      end
      sql_order = "places.id DESC"
      if cookies[:index_min_order].to_i > 0
        sql_where += " AND places.min_order <= #{cookies[:index_min_order]}"
      end
      if cookies[:index_delivery].to_i == 1
        sql_where += " AND places.delivery_price = 0"
      end
      if cookies[:index_rating].to_i == 1
        sql_where += " AND places.rating > 0"
      end
      if cookies[:index_newest] == 1
        sql_order = 'places.created_at DESC'
      end
      if cookies[:index_sorting] == 'rating'
        sql_order = 'places.rating DESC'
      end
      if cookies[:index_sorting] == 'delivery_time'
        sql_order = 'places.delivery_time ASC'
      end
      places = Place.where(sql_where)
      if cookies[:index_kitchens] != nil && cookies[:index_kitchens] != ""
        places = places.joins(:kitchens).where(:kitchens => {:id => cookies[:index_kitchens].split(/,/)})
      end
      if cookies[:index_special].to_i == 1
        places = places.joins(:specials).where(:active => 1)
      end
      @places = places.joins(:partner).where('partners.active' => 1).group("places.id").order(sql_order)#.limit(10)
    end
  end

  def place
    @place = Place.where({:id => params[:id], :active => 1}).first
    @title = @place.name.to_s + " | " + @title
    @specials = @place.specials.where(:active => 1)
    @top = Item.where(:popular => 1, :active => 1).joins(:section).where("sections.view" => "g", "sections.place_id" => params[:id], "sections.active" => 1).limit(3)
    @sections = @place.sections.where(:active => 1).order("sort ASC")
  end

  def success
    @title = "Заказ принят | " + @title
    @order = Order.find(params[:id])
  end

  def license
    @title = "Пользовательское соглашение | " + @title
  end

  def contact
    @title = "Контакты | " + @title
  end

  def vacancy
    @title = "Вакансии | " + @title
  end

  def partnership
    @title = "Для ресторанов | " + @title
  end

  def welcome
    @title = "Svek.la {свекла} — это единая служба доставки любимой еды и цветов в Челябинске. Заказывай у нас и получай подарки!"
    render 'welcome' #, :layout => 'nil'

  end

end
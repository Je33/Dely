# encoding: utf-8
class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :title_set, :splash, :order_time,  :deny_banned

    def deny_banned
    if user_signed_in?
      if current_user.active == 0
        sign_out
        flash[:notice] = "Данный пользователь не активен"
      else

      end

    end
    if user_signed_in?
      if params[:controller].split('/')[0] == 'partner' && current_user.access == 4
         redirect_to "/desc"
         #flash[:notice] = "тут"
      end
    end
  end


  # order time
  # Chelyabinsk time +2
  HOUR_START = 10
  HOUR_END = 18

  def order_time
    if Time.now.hour.to_i >= HOUR_START && Time.now.hour.to_i < HOUR_END && Time.now.wday != 6 && Time.now.wday != 0
      @allow_order = true
    else
      @allow_order = false
    end
  end

  def splash

    if cookies["splash"] != "1" && !user_signed_in?
      cookies["splash"] = {
          :value => 1,
          :expires => 7.days.from_now,
          :path => '/'
      }
      redirect_to "/welcome"

    end
  end

  def title_set
    @title = "Svek.la {свекла}"
    @descr = "Svek.la {свекла} это новый удобный способ заказывать любимую еду и получать за это подарки."
  end

  SMS_USER = 'tsympov@gmail.com'
  SMS_KEY = 'v88Kga'
  SMS_SENDER = 'Svek.la'
  SMS_DESCR = ''
  #SMS_DESCR = 'Заходи с мобильного: http://m.svek.la'

  rescue_from ActiveRecord::RecordNotFound, :with => :not_found
  rescue_from ActionController::UnknownController, :with => :not_found
  rescue_from AbstractController::ActionNotFound, :with => :not_found
  rescue_from URI::InvalidURIError, :with => :not_found

  #rescue_from Exception, :with => :not_found

  def not_found
    redirect_to "/404"
  end

  def index
   @bred=[]

    #f.close
  end

  def breds
    @bred=[]
    @bred[0]=['Заказы <sup class="order_count">' + role_orders.where("status_id IN (60,61,62,70)").count.to_s + '</sup>', partner_orders_path]
  end

  def partners_only
    if (current_user.access==2) or  (current_user.access==4)
      else
      flash[:notice]='Только партнеры и администраторы могут видеть данную информацию'
      redirect_to '/partner/orders'
    end
  end

  def desc_role
    if current_user
      if current_user.access < 3
        flash[:notice]='Недостаточно прав'
        redirect_to '/'
      end
    else
      flash[:notice]='Авторизируйтесь или зарегестрируйтесь'
      redirect_to '/'
    end
  end

  def admins
    if current_user
       if current_user.access==0
        flash[:notice]='Недостаточно прав'
        redirect_to '/'
       end
    else
      flash[:notice]='Авторизируйтесь или зарегестрируйтесь'
      redirect_to '/'
    end
  end

  def global_admins
    if user_signed_in?
      if current_user.access < 4
        flash[:notice]='Недостаточно прав'
        redirect_to '/'
      end
    else
      flash[:notice]='Авторизируйтесь или зарегестрируйтесь'
      redirect_to '/'
    end
  end

  def global_operators
    if user_signed_in?
      if current_user.access < 3
        flash[:notice]='Недостаточно прав'
        redirect_to '/'
      end
    else
      flash[:notice]='Авторизируйтесь или зарегестрируйтесь'
      redirect_to '/'
    end
  end

  def not_operators
    #Досступ оператору=1 и глобальному оператору=3 закрыть
      if current_user.access==1 or current_user.access==3 # or current_user.access==4
        flash[:notice]='Доступ только администраторам и партнерам'
        redirect_to '/partner/orders'
      end
  end

  def role_orders
    #заказы в зависимости от статуса
    case current_user.access
      when 1
          #оператор у партнера
         Order.where('place_id in (?) and status_id >=60 and status_id!=20 and status_id>1',current_user.place_accesses.map{|p| p.place_id})
      when 2   #партнер-админ ресторана
        #@orders=[]
        #Получаем партнера
        if Partner.exists?(:user_id => current_user.id)
          partner_id=current_user.partner.id
        else
          partner_id=current_user.place_accesses.first.place.partner_id
        end
        Order.where('place_id IN (?) and status_id >= 60',Place.where(:partner_id=>partner_id).map{|p| p.id}.uniq)
      when 3
        #глобальный оператор
       Order.where('status_id <60 and status_id>1')
      when 4
        #супер-пупер админ
        Order.where('id > 0 and status_id>1')
      when 0
        nil
      end
  end

  def partner_admin_places_id
    #id ресторанов
    places_id=[]
    if  current_user.access==4
      places_id = Place.all.map{|p| p.id}
    else
      if current_user.access==2
        if current_user.place_accesses.first
           current_user.place_accesses.first.place.partner.places.map{|p| places_id<<p.id}
        end
        if current_user.partner
          current_user.partner.places.map{|p|  places_id<<p.id}
        end
      end
    end

    places_id.uniq
  end


  def finance_orders_price(id)
    finance = Finance.find(id)
    price = 0
    orders=Place.find(finance.place_id).orders.where('created_at >= ? AND created_at <= ? AND (status_id = 100)',finance.period.beginning_of_month,finance.period.end_of_month).map{|o| (price = price + o.price.to_i)}
    finance.price = price
    finance.save
  end

  def setUserAccess id
    @user=User.find(id)
    @user.access=0
    if PlaceAccess.exists?(:user_id=>@user.id,:access=>'1')
      @user.access=1
    end

    if PlaceAccess.exists?(:user_id=>@user.id,:access=>'2')
      @user.access=2
    end

    if Partner.exists?(:user_id=>@user.id)
      @user.access=2
    end
    @user.save
  end
end


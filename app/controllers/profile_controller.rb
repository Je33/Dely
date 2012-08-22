# encoding: utf-8
class ProfileController < ApplicationController

  before_filter :authenticate_user!
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
      end
    end
  end

  def check_order
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
    @order = Order.where(ord_p).last
    if @order != nil
      @order_p = @order.place
    end
  end

  def descr_set
    @descr = "Svek.la {свекла} это новый удобный способ заказывать любимую еду из ресторанов в #{@city[:name_dec]} и получать за это подарки."
  end

  def info
    @title = "Мой профиль | " + @title
    if params[:user]
      current_user.update_attributes(params[:user])
      flash[:notice] = t(:save_changes)
    end
    if params[:pass]
      if current_user.valid_password?(params[:pass][:old])
        if params[:pass][:new] == params[:pass][:renew]
          current_user.update_attributes({:password => params[:pass][:new]})
          flash[:notice] = t(:save_changes)
        else
          flash[:error] = t(:passwords_not_equal)
        end
      else
        flash[:error] = t(:password_is_invalid)
      end
    end
    @orders = Order.where("user_id = ? AND status_id > 1", current_user.id)
  end

  def orders
    @title = "Мои заказы | " + @title
    @orders = Order.where("user_id = ? AND status_id > 1", current_user.id).order("id DESC")
  end

  def gifts
    @title = "Призы | " + @title
    @gifts = Gift.where(:active => 1).order('cost ASC')
    @gorders = current_user.usergifts
  end

end

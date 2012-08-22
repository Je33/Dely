class FormsController < ApplicationController
  layout 'nil'

  def login
    # render login.html
  end

  def registration
    # render registration.html
  end

  def forget
    # render forget.html
  end

  def ord_det
    @order = Order.find(params[:id])
  end

  def address
    if params[:id].to_i > 0
      @adr = Address.find(params[:id])
    else
      @adr = Address.new
    end
    @city = City.find(params[:city])
    # render address.html
  end

  def product
    if params[:id]
      @item = Item.find(params[:id])
      @item_next = Item.where("id > ? AND active = 1 AND section_id = ?", @item.id, @item.section_id).order("id ASC").first
      @item_prev = Item.where("id < ? AND active = 1 AND section_id = ?", @item.id, @item.section_id).order("id DESC").first
    end
    # render product.html
  end

  def basket
    if params[:id]
      @order = Order.find(params[:id])
      if cookies[:city]
        @city = City.find(cookies[:city])
      end
      if user_signed_in?
        @order.update_attribute(:user_id, current_user.id)
      end
    end
    # render basket.html
  end

  def special
    if params[:id]
      @special = Special.find(params[:id])
    end
    # render special.html
  end

  def ordercansel
    @order = Order.find(params[:id])
    # render ordercansel.html
  end

  def estimate
    @place = Place.find(params[:place])
  end

  def asset
    if params[:n]
      respond_to do |format|
        format.js {render "app/assets/javascripts/forms/" + params[:n].to_s}
      end
    end
    # get js file for form
  end

end

# encoding: utf-8
class Partner::IndexController < ApplicationController
  before_filter :admins, :partners_only, :breds, :title_set
  layout 'partner'

  def title_set
    @title = "Svek.la {свекла}"
    @descr = "Svek.la {свекла} это новый удобный способ заказывать любимую еду и получать за это подарки."
    @title = "Личный кабинет | " + @title
  end


  def index

      @partner_bred=[]
      @partner_bred[0]=['Статистика','/partner']

    @bread = [['Главная']]
    @orders = Order.where('status_id > ?', 62)
    places_ids = partner_admin_places_id
    @ord_yd = @orders.where('created_at >= ? AND created_at <= ?', Time.now.beginning_of_day - 1.day, Time.now.end_of_day - 1.day).where(:place_id => places_ids)
    @ord_td = @orders.where('created_at >= ? AND created_at <= ?', Time.now.beginning_of_day, Time.now.end_of_day).where(:place_id => places_ids)
      @dates=[]
      time=Time.now
      while Time.now-2.years < time  do
        @dates<<[((I18n.t time.strftime("%B"))+time.strftime(" %Y")),time.strftime("%Y-%m-01")]
        time=time-1.month
      end


  end
end
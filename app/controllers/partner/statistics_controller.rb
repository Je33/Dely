# encoding: utf-8
class Partner::StatisticsController < ApplicationController

  before_filter :breadcrumbs
  before_filter :authenticate_user!
  before_filter :admins
  before_filter :not_operators, :title_set, :global_orders, :breds
  layout 'partner'

  def global_orders
    global_orders = role_orders
  end

  def title_set
    @title = "Svek.la {свекла}"
    @descr = "Svek.la {свекла} это новый удобный способ заказывать любимую еду и получать за это подарки."
    @title = "Личный кабинет | " + @title
  end

  def breadcrumbs
    @bread = [['Главная', '/desc'], ['Статистика', '/desc/statistics']]
  end

  def index
    @title = "Статистика | " + @title
    @places = Place.find(partner_admin_places_id)
    @orders = Order.where("status_id > ?", 1)
  end

  def show
    @title = "Статистика | " + @title
    @places = Place.find(partner_admin_places_id)
    @orders = Order.where("status_id > ?", 1)
  end

end
# encoding: utf-8
class Desc::StatisticsController < ApplicationController

  before_filter :global_admins, :breadcrumbs, :get_vars
  layout 'desc'

  def get_vars
    @places = Place.where(:active => 1)
    @orders = Order.where("status_id > ?", 1)
  end

  def breadcrumbs
    @bread = [['Главная', '/desc'], ['Статистика', '/desc/statistics']]
  end

  def index
  end

  def show
  end

  def orders_count
    @bread << ['Заказы']
  end

  def orders_summ
    @bread << ['Сумма']
  end

  def populars
    @bread << ['Популярные']
  end

end
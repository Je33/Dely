# encoding: utf-8
class DescController < ApplicationController
  before_filter :global_admins
  layout 'desc'
  def index
    @bread = [['Главная']]
    @orders = Order.where('status_id > ?', 1)
    @ord_yd = @orders.where('created_at >= ? AND created_at <= ?', Time.now.beginning_of_day - 1.day, Time.now.end_of_day - 1.day)
    @ord_td = @orders.where('created_at >= ? AND created_at <= ?', Time.now.beginning_of_day, Time.now.end_of_day)

    #@places=Finance.all.map{|f| f.place_id},uniq
    @dates=[]
    @dates<<['Все время',0]
    time=Time.now
    while Time.now-2.years < time  do
      @dates<<[((I18n.t time.strftime("%B"))+time.strftime(" %Y")),time.strftime("%Y-%m-01")]
      time=time-1.month
    end

    @finances=Finance.where('period = ?',params[:period])

  end
end

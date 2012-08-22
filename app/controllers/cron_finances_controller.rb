class CronFinancesController < ApplicationController
  def cron
    Place.all.each do |p|
      time =(Time.now - 1.month).to_date #.strftime("%Y-%m-01").to_date
      orders = p.orders.where('created_at >= ? AND created_at <= ? AND (status_id>=60 or status_id=20)',time.beginning_of_month,time.end_of_month)
      price=0
      orders.map{|o| price+=o.price}

      finance = Finance.new({
                                :finance_status_id => 10,
                                :period => Time.now.strftime("%Y-%m-01"),
                                :place_id => p.id,
                                :price => price,
                                :cnt => orders.count
                            })
      finance.save
    end
  end
end
#CronFinancesController.cron

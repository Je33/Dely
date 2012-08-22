class Finance < ActiveRecord::Base
  belongs_to :place
  has_one :partner, :through => :place
  has_many :fiance_reports , :dependent => :delete_all
  belongs_to :finance_status

  def status
    self.finance_status ? self.finance_status.name : :Unkhown
  end

  def findClass
    case self.finance_status_id
      when 10
        'new-order'
      when 20
        'confirmed-order'
      when 30
        'perform-order'
      when 40
        'no-perform-order'
      when 50
        'delivered-order'
      else
        ''
    end
  end

  def findRowClass
    case self.finance_status_id
      when 10
        'not-ordered'
      when 20
        'ordered'
      when 30
        'send'
      when 40
        'need-call'
      when 50
        'pay-in'
      else
        ''
    end
  end

  def self.cron_finance
    Place.all.each do |p|
      #time =(Time.now - 1.month).to_date #.strftime("%Y-%m-01").to_date
      time =(Time.now).to_date
      #orders = p.orders.where('created_at >= ? AND created_at <= ? AND (status_id>=60 or status_id=20)',time.beginning_of_month,time.end_of_month)
      orders = p.orders.where('created_at >= ? AND created_at <= ? AND status_id=100',time.beginning_of_month,time.end_of_month)
      price = 0
      price = price.to_f
      orders.map{|o| (price=price+o.price.to_f)}
      if Finance.exists?({
                             :finance_status_id => 10,
                             :period => Time.now.strftime("%Y-%m-01"),
                             :place_id => p.id,
                             #:price => price,
                             :cnt => orders.count
                         })
      else
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

end

class Status < ActiveRecord::Base
  has_one :order
  has_many :logs
  attr_accessible :id, :name

  def findClass
    case self.id
      when 10
        'new-order'
      # принят рестораном — 80
      when 80

        'order-accepted'

      when 30, 55
        'confirmed-order'
      when 60..62
        'perform-order'

      when 70

        'perform-order'

      when 40, 1
        'no-perform-order'
      when 20, 50, 90
        'canseled-order'
      when 100, 95
        'delivered-order'
      else
        ''
    end
  end


end

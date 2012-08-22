class Basket < ActiveRecord::Base
  belongs_to :order
  belongs_to :item

 def itemCntPrice #Цена с учетом количества
     price=(Item.find(self.item_id).price * self.cnt).ceil
 end


end

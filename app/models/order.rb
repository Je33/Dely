class Order < ActiveRecord::Base

  scope :activated, where("status_id > 1 and status_id < 100")

  belongs_to :city
  belongs_to :metro
  belongs_to :region
  belongs_to :user
  belongs_to :place
  belongs_to :status
  has_many :baskets, :dependent => :delete_all
  has_many :items, :through => :baskets
  has_many :logs, :dependent => :delete_all
  #named_scope :active, :conditions => ['status_id > ?', 1]

  #def delit
  #  Basket.delete_all(:place_id=>self.id)
  #  self.destroy
  #end


end

class Special < ActiveRecord::Base
  scope :activated, where(:active => 1)
  belongs_to :place
  belongs_to :item
  has_one :section, :through => :item
  has_one :partner, :through => :place
  #has_one :item
  has_attached_file :picture,
                    :url => :default_url,
                    :path => :default_path,
                    :styles => {:normal => "190x142#"}

  validates :name, :description, :old_price, :presence => true

  #def self.item
    #Item.exists?(self.item_id) ?  Item.find(self.item_id) : nil
  #end

  private
  def default_url
    "/picture/special/"+self.id.to_s+ "/:style/:basename.:extension"
  end

  def default_path
    ":rails_root/public/picture/special/"+self.id.to_s+"/:style/:basename.:extension"
  end
end

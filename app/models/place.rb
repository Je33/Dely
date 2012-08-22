class Place < ActiveRecord::Base
  scope :activated, where(:active => 1)
  belongs_to :partner
  has_and_belongs_to_many :kitchens
  has_many :orders
  has_many :users
  has_many :finances, :dependent => :delete_all
  has_many :specials, :dependent => :delete_all
  has_many :sections, :dependent => :destroy
  has_many :orders, :dependent => :destroy
  has_many :place_accesses, :dependent => :delete_all
  has_many :delivery_prices, :dependent => :delete_all


  has_attached_file :picture,
                    :url => :default_url,
                    :path => :default_path,
                    :styles => {:large => "x400", :normal => "x200", :small => "135x250", :mini => "x30", :index => "220x220"}
  belongs_to :city

  #def delit
  #  Section.where(:place_id=>self.id).each do |s|
  #    s.delit
  #  end
  #  Orders.where(:place_id=>self.id).each do |o|
  #    o.delit
  #  end
  #  self.destroy
  #end

  private
  def default_url
    "/picture/place/"+self.id.to_s+ "/:style/:basename.:extension"
  end

  def default_path
    ":rails_root/public/picture/place/"+self.id.to_s+"/:style/:basename.:extension"
  end

end

class Item < ActiveRecord::Base
  scope :activated, where(:active => 1)
  belongs_to :section
  has_one :special, :dependent => :delete
  has_many :baskets, :dependent => :delete_all
  has_many :orders, :through => :baskets
  has_many :populars, :dependent => :delete_all
  has_one :place, :through => :section
  has_one :partner, :through => :place
  has_attached_file :photo,
                    :url => :default_url,
                    :path =>:default_path,
                    :styles =>   {:large => "400x300", :top => "150x112#", :normal => "220x165#", :small => "45x45#", :mini => "70x70#"}

  private
  def default_url
    "/photo/"+self.section_id.to_s+'/'+self.id.to_s+ "/:style/:basename.:extension"
  end

  def default_path
    ":rails_root/public/photo/"+self.section_id.to_s+'/'+self.id.to_s+"/:style/:basename.:extension"
  end

end

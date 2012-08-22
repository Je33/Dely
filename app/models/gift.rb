class Gift < ActiveRecord::Base
  scope :activated, where(:active => 1)
  belongs_to :gift_section
  belongs_to :usergift
  has_attached_file :photo,
                    :url => :default_url,
                    :path =>:default_path,
                    :styles =>   {:large => "400x300", :normal => "220x165#", :small => "45x45#", :mini => "30x"}

  private
  def default_url
    "/photo/gifts/"+self.gift_section_id.to_s+'/'+self.id.to_s+ "/:style/:basename.:extension"
  end


  def default_path
    ":rails_root/public/photo/gifts/"+self.gift_section_id.to_s+'/'+self.id.to_s+"/:style/:basename.:extension"
  end
end

class Popular < ActiveRecord::Base
  scope :activated, where(:active => 1)
  belongs_to :item
  has_attached_file :picture,
                    :url => :default_url,
                    :path => :default_path,
                    :styles => {:large => "x400", :normal => "x200", :small => "135x250", :mini => "x30"}

  private
  def default_url
    "/picture/popular/"+self.id.to_s+ "/:style/:basename.:extension"
  end

  def default_path
    ":rails_root/public/picture/popular/"+self.id.to_s+"/:style/:basename.:extension"
  end
end

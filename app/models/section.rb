class Section < ActiveRecord::Base
  scope :activated, where(:active => 1)
  belongs_to :place
  has_many :items, :dependent => :destroy

  #def delit
  #  Item.delete_all(:section_id=>self.id)
  #  self.destroy
  #end
end

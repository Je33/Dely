class Kitchen < ActiveRecord::Base
  scope :activated, where(:active => 1)
  has_and_belongs_to_many :places
end

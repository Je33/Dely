class Region < ActiveRecord::Base
  scope :activated, where(:active => 1)
  belongs_to :city
  has_many :orders
  has_many :addresses
end

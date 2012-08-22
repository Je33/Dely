class City < ActiveRecord::Base
  scope :activated, where(:active => 1)
  has_many :users
  has_many :orders
  has_many :metros
  has_many :regions
  has_many :addresses
  has_one :place
end

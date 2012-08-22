class DeliveryPrice < ActiveRecord::Base
  scope :to_regions, where(:condition => "region")
  scope :to_metros, where(:condition => "metro")
  belongs_to :place
  belongs_to :region
  has_one :order, :through => :place
end

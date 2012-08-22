class GiftSection < ActiveRecord::Base
  scope :activated, where(:active => 1)
end

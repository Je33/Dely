class GiftStatus < ActiveRecord::Base
  has_one :usergift
  attr_accessible :id,:name
end

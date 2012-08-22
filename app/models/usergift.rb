class Usergift < ActiveRecord::Base
  belongs_to :user
  belongs_to :gift_status
  belongs_to :gift
end

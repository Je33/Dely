class FinanceStatus < ActiveRecord::Base
  has_one :finance
  attr_accessible :id,:name

end

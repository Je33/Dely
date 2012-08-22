class Address < ActiveRecord::Base
  belongs_to :city
  belongs_to :metro
  belongs_to :region
  belongs_to :user
end

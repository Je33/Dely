class Partner < ActiveRecord::Base
  scope :activated, where(:active => 1)
  belongs_to :user
  has_many :items, :through => :baskets
  #has_many :places , :dependent => :delete_all
  has_many :places , :dependent => :destroy
  has_many :finances, :through => :places
  has_many :orders, :through => :places
end

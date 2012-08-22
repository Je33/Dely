class AddCntToBasket < ActiveRecord::Migration
  def self.up
    add_column :baskets, :cnt, :integer
  end
  def self.down
    remove_column :baskets, :cnt
  end
end

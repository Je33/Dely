class AddSizeToPopulars < ActiveRecord::Migration
  def self.up
    add_column :populars, :size, :integer
  end
  def self.down
    remove_column :populars, :size
  end
end

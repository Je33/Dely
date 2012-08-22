class AddColumnsToOrder < ActiveRecord::Migration
  def self.up
    add_column :orders, :city_id, :integer
    add_column :orders, :region_id, :integer
    add_column :orders, :metro_id, :integer
  end
  def self.down
    remove_column :orders, :city_id
    remove_column :orders, :region_id
    remove_column :orders, :metro_id
  end
end

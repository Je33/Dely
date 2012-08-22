class AddSessidToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :sess_id, :string
  end
  def self.down
    remove_column :orders, :sess_id
  end
end

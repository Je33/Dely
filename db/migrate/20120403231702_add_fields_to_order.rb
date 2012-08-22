class AddFieldsToOrder < ActiveRecord::Migration
  def self.up
    add_column :orders, :change, :float
    add_column :orders, :street, :string
    add_column :orders, :house, :string
    add_column :orders, :building, :string
    add_column :orders, :room, :string
    add_column :orders, :floor, :string
    add_column :orders, :porch, :string
    add_column :orders, :intercom, :string
  end
  def self.down
    remove_column :orders, :change
    remove_column :orders, :street
    remove_column :orders, :house
    remove_column :orders, :building
    remove_column :orders, :room
    remove_column :orders, :floor
    remove_column :orders, :porch
    remove_column :orders, :intercom
  end
end

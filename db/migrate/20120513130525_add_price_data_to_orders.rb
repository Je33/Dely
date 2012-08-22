class AddPriceDataToOrders < ActiveRecord::Migration
  def up
    add_column :orders, :price_base, :float
    add_column :orders, :price_delivery, :float
  end

  def down
    remove_column :orders, :price_base
    remove_column :orders, :price_delivery
  end
end

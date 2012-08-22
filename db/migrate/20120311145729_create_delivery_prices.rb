class CreateDeliveryPrices < ActiveRecord::Migration
  def change
    create_table :delivery_prices do |t|
      t.string :condition
      t.integer :price
      t.references :place
      t.references :region

      t.timestamps
    end
    add_index :delivery_prices, :place_id
    add_index :delivery_prices, :region_id
  end
end

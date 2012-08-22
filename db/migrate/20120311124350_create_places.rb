class CreatePlaces < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.integer :active
      t.string :name
      t.text :description
      t.integer :min_order
      t.integer :delivery_price
      t.string :delivery_time
      t.integer :rating_plus
      t.integer :rating_minus

      t.timestamps
    end
  end
end

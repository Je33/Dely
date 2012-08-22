class CreateAddresses < ActiveRecord::Migration
  def change
    create_table :addresses do |t|
      t.string :name
      t.text :description
      t.references :city
      t.references :metro
      t.references :region
      t.string :street
      t.string :house
      t.string :building
      t.string :room
      t.string :porch
      t.string :floor
      t.string :intercom
      t.references :user

      t.timestamps
    end
    add_index :addresses, :city_id
    add_index :addresses, :metro_id
    add_index :addresses, :region_id
    add_index :addresses, :user_id
  end
end

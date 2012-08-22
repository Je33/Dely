class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.string :name
      t.text :description
      t.integer :person
      t.integer :manager
      t.integer :rating
      t.references :user
      t.references :place
      t.references :status

      t.timestamps
    end
    add_index :orders, :user_id
    add_index :orders, :place_id
    add_index :orders, :status_id
  end
end

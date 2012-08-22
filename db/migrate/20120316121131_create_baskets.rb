class CreateBaskets < ActiveRecord::Migration
  def change
    create_table :baskets do |t|
      t.integer :order_id
      t.integer :item_id

      t.timestamps
    end
  end
end

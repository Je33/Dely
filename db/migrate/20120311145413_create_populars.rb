class CreatePopulars < ActiveRecord::Migration
  def change
    create_table :populars do |t|
      t.integer :active
      t.string :name
      t.references :item

      t.timestamps
    end
    add_index :populars, :item_id
  end
end

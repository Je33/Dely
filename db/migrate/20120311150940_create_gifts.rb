class CreateGifts < ActiveRecord::Migration
  def change
    create_table :gifts do |t|
      t.integer :active
      t.string :name
      t.text :description
      t.integer :cost
      t.references :gift_section

      t.timestamps
    end
    add_index :gifts, :gift_section_id
  end
end

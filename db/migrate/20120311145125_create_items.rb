class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.integer :active
      t.integer :sort
      t.string :name
      t.text :description
      t.references :section
      t.references :special

      t.timestamps
    end
    add_index :items, :section_id
    add_index :items, :special_id
  end
end

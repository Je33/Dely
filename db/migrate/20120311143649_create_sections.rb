class CreateSections < ActiveRecord::Migration
  def change
    create_table :sections do |t|
      t.integer :active
      t.integer :sort
      t.string :name
      t.text :description
      t.integer :view
      t.references :place

      t.timestamps
    end
    add_index :sections, :place_id
  end
end

class CreateSpecials < ActiveRecord::Migration
  def change
    create_table :specials do |t|
      t.integer :active
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end

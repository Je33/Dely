class CreateMetros < ActiveRecord::Migration
  def change
    create_table :metros do |t|
      t.string :name
      t.references :city

      t.timestamps
    end
    add_index :metros, :city_id
  end
end

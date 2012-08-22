class CreateRegions < ActiveRecord::Migration
  def change
    create_table :regions do |t|
      t.string :name
      t.string :code
      t.references :city

      t.timestamps
    end
    add_index :regions, :city_id
  end
end

class AddActiveToRegions < ActiveRecord::Migration
  def up
    add_column :regions, :active, :integer
    add_column :metros, :active, :integer
  end
  def down
    remove_column :regions, :active
    remove_column :metros, :active
  end
end

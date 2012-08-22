class AddActiveToCities < ActiveRecord::Migration
  def up
    add_column :cities, :active, :integer
    add_column :kitchens, :active, :integer
  end
  def down
    remove_column :cities, :active
    remove_column :kitchens, :active
  end
end

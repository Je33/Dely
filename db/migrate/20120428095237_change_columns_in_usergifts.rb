class ChangeColumnsInUsergifts < ActiveRecord::Migration
  def up
    remove_column :usergifts, :name
    remove_column :usergifts, :price
  end

  def down
    add_column :usergifts, :name, :string
    add_column :usergifts, :price, :integer
  end
end

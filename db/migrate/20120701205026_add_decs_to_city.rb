class AddDecsToCity < ActiveRecord::Migration
  def up
    add_column :cities, :name_dec, :string
    add_column :cities, :name_title, :string
  end
  def down
    remove_column :cities, :name_dec
    remove_column :cities, :name_title
  end
end

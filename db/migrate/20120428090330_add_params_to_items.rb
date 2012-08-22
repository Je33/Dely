class AddParamsToItems < ActiveRecord::Migration
  def up
    add_column :items, :hot, :integer
    add_column :items, :vegetarian, :integer
    add_column :items, :calories, :string
    add_column :items, :weight, :string
  end
  def down
    remove_column :items, :hot
    remove_column :items, :vegetarian
    remove_column :items, :calories
    remove_column :items, :weight
  end
end

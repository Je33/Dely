class AddPopularToItems < ActiveRecord::Migration
  def self.up
    add_column :items, :popular, :integer
  end
  def self.down
    remove_column :items, :popular
  end
end

class AddColumnsToSpecials < ActiveRecord::Migration
  def self.up
    add_column :specials, :place_id, :integer
  end
  def self.down
    remove_column :specials, :place_id
  end
end

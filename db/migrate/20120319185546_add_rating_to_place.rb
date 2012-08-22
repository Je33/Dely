class AddRatingToPlace < ActiveRecord::Migration
  def self.up
    add_column :places, :rating, :integer
  end

  def self.down
    remove_column :places, :rating
  end
end

class AddCountToSection1 < ActiveRecord::Migration
  def self.up
    add_column :sections, :cnt, :integer
  end

  def self.down
    remove_column :sections, :cnt
  end
end

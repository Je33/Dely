class AddIndexToSpecial < ActiveRecord::Migration
  def change
    add_index :specials, :item_id
  end
end

class AddSpecialItem < ActiveRecord::Migration
  def up
    remove_column :items, :special_id
    add_column :specials, :item_id, :integer
    add_column :specials, :old_price, :float
  end

  def down
    add_column :items, :special_id, :integer
    remove_column :specials, :item_id
    remove_column :specials, :old_price
  end
end

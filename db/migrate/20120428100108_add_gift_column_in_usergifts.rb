class AddGiftColumnInUsergifts < ActiveRecord::Migration
  def up
    add_column :usergifts, :gift_id, :integer
  end

  def down
    remove_column :usergifts, :gift_id
  end
end

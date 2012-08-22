class AddColumnsToGiftUser < ActiveRecord::Migration
  def up
    add_column :usergifts, :status_id, :integer
  end
  def down
    remove_column :usergifts, :status_id
  end
end

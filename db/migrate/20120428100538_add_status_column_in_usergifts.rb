class AddStatusColumnInUsergifts < ActiveRecord::Migration
  def up
    add_column :usergifts, :gift_status_id, :integer
  end

  def down
    remove_column :usergifts, :gift_status_id
  end
end

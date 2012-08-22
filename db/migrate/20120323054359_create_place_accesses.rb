class CreatePlaceAccesses < ActiveRecord::Migration
  def change
    create_table :place_accesses do |t|
      t.integer :place_id
      t.integer :user_id
      t.integer :access

      t.timestamps
    end
  end
end

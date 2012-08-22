class CreateFinances < ActiveRecord::Migration
  def change
    create_table :finances do |t|
      t.integer :fin_status_id
      t.date :period
      t.integer :place_id
      t.float :price
      t.integer :cnt

      t.timestamps
    end
  end
end

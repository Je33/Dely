class CreateUsergifts < ActiveRecord::Migration
  def change
    create_table :usergifts do |t|
      t.string :name
      t.text :description
      t.integer :price
      t.integer :user_id

      t.timestamps
    end
  end
end

class CreatePartners < ActiveRecord::Migration
  def change
    create_table :partners do |t|
      t.integer :user_id
      t.integer :place_id
      t.text :name

      t.timestamps
    end
  end
end

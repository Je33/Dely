class CreateGiftSections < ActiveRecord::Migration
  def change
    create_table :gift_sections do |t|
      t.integer :active
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end

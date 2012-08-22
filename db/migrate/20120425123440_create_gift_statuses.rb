class CreateGiftStatuses < ActiveRecord::Migration
  def change
    create_table :gift_statuses do |t|
      t.string :name

      t.timestamps
    end
  end
end

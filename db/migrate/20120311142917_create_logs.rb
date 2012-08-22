class CreateLogs < ActiveRecord::Migration
  def change
    create_table :logs do |t|
      t.references :user
      t.references :order
      t.references :status

      t.timestamps
    end
    add_index :logs, :user_id
    add_index :logs, :order_id
    add_index :logs, :status_id
  end
end

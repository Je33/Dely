class CreateFinanceStatuses < ActiveRecord::Migration
  def change
    create_table :finance_statuses do |t|
      t.string :name

      t.timestamps
    end
  end
end

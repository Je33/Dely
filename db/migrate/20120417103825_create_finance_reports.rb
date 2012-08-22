class CreateFinanceReports < ActiveRecord::Migration
  def change
    create_table :finance_reports do |t|
      t.integer :finance_id
      t.binary :generate
      t.binary :send

      t.timestamps
    end
  end
end

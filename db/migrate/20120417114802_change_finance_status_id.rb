class ChangeFinanceStatusId < ActiveRecord::Migration
  def change
    rename_column :finances, :fin_status_id, :finance_status_id
  end
end

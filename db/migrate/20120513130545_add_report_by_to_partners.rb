class AddReportByToPartners < ActiveRecord::Migration
  def up
    add_column :partners, :report_by_email, :string
    add_column :partners, :report_by_phone, :string
    add_column :partners, :report_by_sms, :string
  end
  def down
    remove_column :partners, :report_by_email
    remove_column :partners, :report_by_phone
    remove_column :partners, :report_by_sms
  end
end

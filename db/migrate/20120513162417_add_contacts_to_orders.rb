class AddContactsToOrders < ActiveRecord::Migration
  def up
    add_column :partners, :orders_contact, :string
    add_column :partners, :report_contact, :string
  end
  def down
    remove_column :partners, :orders_contact
    remove_column :partners, :report_contact
  end
end

class AddByEmailBySmsByPhoneToPartners < ActiveRecord::Migration
  def self.up
    add_column :partners, :by_email, :string
    add_column :partners, :by_sms, :string
    add_column :partners, :by_phone, :string
    #add_column :partners, :type, :integer
  end
  def self.down
    remove_column :partners, :by_email
    remove_column :partners, :by_sms
    remove_column :partners, :by_phone
    #remove_column :partners, :type
  end
end

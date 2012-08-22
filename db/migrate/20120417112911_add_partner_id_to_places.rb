class AddPartnerIdToPlaces < ActiveRecord::Migration
  def self.up
    add_column :places, :partner_id, :integer
  end
  def self.down
    remove_column :places, :partner_id
  end
end

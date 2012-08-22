class AddColumnsToPartners < ActiveRecord::Migration
  def up
    add_column :partners, :active, :integer
    add_column :partners, :pct, :integer
    add_column :partners, :director, :string
    add_column :partners, :phone, :string
    add_column :partners, :email, :string
    add_column :partners, :address, :text
  end

  def down
    remove_column :partners, :active
    remove_column :partners, :pct
    remove_column :partners, :director
    remove_column :partners, :phone
    remove_column :partners, :email
    remove_column :partners, :address
  end
end

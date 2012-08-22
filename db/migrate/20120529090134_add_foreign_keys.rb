class AddForeignKeys < ActiveRecord::Migration
=begin
  add_foreign_key(:places, :partners)
  add_foreign_key(:specials, :places)
  add_foreign_key(:sections, :places)
  add_foreign_key(:orders, :places)
  add_foreign_key(:place_accesses, :places)
  add_foreign_key(:delivery_prices, :places)
  add_foreign_key(:items, :sections)


=end
end

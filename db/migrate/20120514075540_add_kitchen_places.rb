class AddKitchenPlaces < ActiveRecord::Migration
  def change
    create_table :kitchens_places do |t|
      t.integer  :place_id
      t.integer  :kitchen_id
    end
  end
end

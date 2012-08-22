# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120701205026) do

  create_table "addresses", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "city_id"
    t.integer  "metro_id"
    t.integer  "region_id"
    t.string   "street"
    t.string   "house"
    t.string   "building"
    t.string   "room"
    t.string   "porch"
    t.string   "floor"
    t.string   "intercom"
    t.integer  "user_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "addresses", ["city_id"], :name => "index_addresses_on_city_id"
  add_index "addresses", ["metro_id"], :name => "index_addresses_on_metro_id"
  add_index "addresses", ["region_id"], :name => "index_addresses_on_region_id"
  add_index "addresses", ["user_id"], :name => "index_addresses_on_user_id"

  create_table "baskets", :force => true do |t|
    t.integer  "order_id"
    t.integer  "item_id"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
    t.integer  "cnt",        :default => 1, :null => false
  end

  create_table "cities", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "active"
    t.string   "name_dec"
    t.string   "name_title"
  end

  create_table "delivery_prices", :force => true do |t|
    t.string   "condition"
    t.integer  "price"
    t.integer  "place_id"
    t.integer  "region_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "delivery_prices", ["place_id"], :name => "index_delivery_prices_on_place_id"
  add_index "delivery_prices", ["region_id"], :name => "index_delivery_prices_on_region_id"

  create_table "finance_reports", :force => true do |t|
    t.integer  "finance_id"
    t.binary   "generate"
    t.binary   "send"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "finance_statuses", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "finances", :force => true do |t|
    t.integer  "finance_status_id"
    t.date     "period"
    t.integer  "place_id"
    t.float    "price"
    t.integer  "cnt"
    t.datetime "created_at",        :null => false
    t.datetime "updated_at",        :null => false
  end

  create_table "gift_sections", :force => true do |t|
    t.integer  "active"
    t.string   "name"
    t.text     "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "gift_statuses", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "gifts", :force => true do |t|
    t.integer  "active"
    t.string   "name"
    t.text     "description"
    t.integer  "cost"
    t.integer  "gift_section_id"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
  end

  add_index "gifts", ["gift_section_id"], :name => "index_gifts_on_gift_section_id"

  create_table "items", :force => true do |t|
    t.integer  "active"
    t.integer  "sort"
    t.string   "name"
    t.text     "description"
    t.integer  "section_id"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
    t.float    "price"
    t.integer  "popular"
    t.integer  "hot"
    t.integer  "vegetarian"
    t.string   "calories"
    t.string   "weight"
  end

  add_index "items", ["section_id"], :name => "index_items_on_section_id"

  create_table "kitchens", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "active"
  end

  create_table "kitchens_places", :force => true do |t|
    t.integer  "place_id"
    t.integer  "kitchen_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "kitchens_places", ["kitchen_id"], :name => "index_place_kitchens_on_kitchen_id"
  add_index "kitchens_places", ["place_id"], :name => "index_place_kitchens_on_place_id"

  create_table "logs", :force => true do |t|
    t.integer  "user_id"
    t.integer  "order_id"
    t.integer  "status_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "logs", ["order_id"], :name => "index_logs_on_order_id"
  add_index "logs", ["status_id"], :name => "index_logs_on_status_id"
  add_index "logs", ["user_id"], :name => "index_logs_on_user_id"

  create_table "metros", :force => true do |t|
    t.string   "name"
    t.integer  "city_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "active"
  end

  add_index "metros", ["city_id"], :name => "index_metros_on_city_id"

  create_table "orders", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "person"
    t.integer  "manager",        :default => 0, :null => false
    t.integer  "rating"
    t.integer  "user_id"
    t.integer  "place_id"
    t.integer  "status_id"
    t.datetime "created_at",                    :null => false
    t.datetime "updated_at",                    :null => false
    t.float    "price"
    t.string   "sess_id"
    t.float    "change"
    t.string   "street"
    t.string   "house"
    t.string   "building"
    t.string   "room"
    t.string   "floor"
    t.string   "porch"
    t.string   "intercom"
    t.string   "phone"
    t.integer  "city_id"
    t.integer  "region_id"
    t.integer  "metro_id"
    t.float    "price_base"
    t.float    "price_delivery"
  end

  add_index "orders", ["place_id"], :name => "index_orders_on_place_id"
  add_index "orders", ["status_id"], :name => "index_orders_on_status_id"
  add_index "orders", ["user_id"], :name => "index_orders_on_user_id"

  create_table "partners", :force => true do |t|
    t.integer  "user_id"
    t.text     "name"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
    t.integer  "active"
    t.integer  "pct"
    t.string   "director"
    t.string   "phone"
    t.string   "email"
    t.text     "address"
    t.string   "by_phone"
    t.string   "by_sms"
    t.string   "by_email"
    t.string   "report_by_email"
    t.string   "report_by_phone"
    t.string   "report_by_sms"
    t.string   "orders_contact"
    t.string   "report_contact"
  end

  create_table "place_accesses", :force => true do |t|
    t.integer  "place_id"
    t.integer  "user_id"
    t.integer  "access"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "places", :force => true do |t|
    t.integer  "active"
    t.string   "name"
    t.text     "description"
    t.integer  "min_order"
    t.integer  "delivery_price"
    t.string   "delivery_time"
    t.integer  "rating_plus"
    t.integer  "rating_minus"
    t.datetime "created_at",           :null => false
    t.datetime "updated_at",           :null => false
    t.integer  "rating"
    t.integer  "city_id"
    t.string   "picture_file_name"
    t.string   "picture_content_type"
    t.integer  "picture_file_size"
    t.datetime "picture_updated_at"
    t.integer  "partner_id"
  end

  create_table "populars", :force => true do |t|
    t.integer  "active"
    t.string   "name"
    t.integer  "item_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "size"
  end

  add_index "populars", ["item_id"], :name => "index_populars_on_item_id"

  create_table "regions", :force => true do |t|
    t.string   "name"
    t.string   "code"
    t.integer  "city_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "active"
  end

  add_index "regions", ["city_id"], :name => "index_regions_on_city_id"

  create_table "sections", :force => true do |t|
    t.integer  "active"
    t.integer  "sort"
    t.string   "name"
    t.text     "description"
    t.string   "view",        :limit => 1
    t.integer  "place_id"
    t.datetime "created_at",               :null => false
    t.datetime "updated_at",               :null => false
    t.integer  "cnt"
  end

  add_index "sections", ["place_id"], :name => "index_sections_on_place_id"

  create_table "specials", :force => true do |t|
    t.integer  "active"
    t.string   "name"
    t.text     "description"
    t.datetime "created_at",           :null => false
    t.datetime "updated_at",           :null => false
    t.integer  "place_id"
    t.string   "picture_file_name"
    t.string   "picture_content_type"
    t.integer  "picture_file_size"
    t.datetime "picture_updated_at"
    t.integer  "item_id"
    t.float    "old_price"
  end

  add_index "specials", ["item_id"], :name => "index_specials_on_item_id"

  create_table "statuses", :force => true do |t|
    t.string   "name"
    t.integer  "code"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "usergifts", :force => true do |t|
    t.text     "description"
    t.integer  "user_id"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
    t.integer  "status_id"
    t.integer  "gift_id"
    t.integer  "gift_status_id"
  end

  create_table "users", :force => true do |t|
    t.string   "phone",                               :default => "", :null => false
    t.string   "email",                               :default => ""
    t.string   "encrypted_password",                  :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                       :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "authentication_token"
    t.string   "first_name",                          :default => ""
    t.string   "last_name",                           :default => ""
    t.integer  "active",                 :limit => 1, :default => 1
    t.integer  "access",                              :default => 0,  :null => false
    t.integer  "balance",                             :default => 0
    t.integer  "city_id"
    t.datetime "created_at",                                          :null => false
    t.datetime "updated_at",                                          :null => false
    t.string   "uid"
  end

  add_index "users", ["authentication_token"], :name => "index_users_on_authentication_token", :unique => true
  add_index "users", ["phone"], :name => "index_users_on_phone", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  add_foreign_key "specials", "items", :name => "fk_specials_items"

end

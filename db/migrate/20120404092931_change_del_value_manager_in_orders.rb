class ChangeDelValueManagerInOrders < ActiveRecord::Migration
  def change
    change_column(:orders,:manager,:integer,{:null => false,:default=>0})
  end
end

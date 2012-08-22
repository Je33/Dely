class AddDefualtValueToColumnCntInBaskets < ActiveRecord::Migration
  def change
    change_column(:baskets,:cnt,:integer,{:null => false,:default=>1})
  end
end

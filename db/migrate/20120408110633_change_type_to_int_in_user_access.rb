class ChangeTypeToIntInUserAccess < ActiveRecord::Migration
  def change
    change_column(:users,:access,:integer,{:null => false,:default=>0,:length=>4})
  end
end

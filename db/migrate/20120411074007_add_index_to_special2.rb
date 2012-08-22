class AddIndexToSpecial2 < ActiveRecord::Migration
  def change
    execute <<-SQL
      ALTER TABLE specials
        ADD CONSTRAINT fk_specials_items
        FOREIGN KEY (item_id)
        REFERENCES items(id)
    SQL
  end
end

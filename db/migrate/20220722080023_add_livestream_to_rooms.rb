class AddLivestreamToRooms < ActiveRecord::Migration[6.1]
  def change
    add_column :rooms, :livestream, :boolean
  end
end

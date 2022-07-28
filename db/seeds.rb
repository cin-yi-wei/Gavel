require 'faker'
require 'open-uri'
category_architecture = JSON.parse(File.read(Rails.root.to_s + '/config/category.json'))
products_list = JSON.parse(File.read(Rails.root.to_s + '/config/product.json'))

def traverse_category_architecture_to_array(architecture)  #Depth-First-Search
  architecture.keys.each do |key|
    @tag_array.push(key)
    if architecture[key].kind_of?(Array)
      architecture[key].each { |i| @tag_array.push(i) }
    else
      traverse_category_architecture_to_array(architecture[key])
    end
  end
end

def random_category_path(architecture)
  sample = architecture.keys.sample
  @category_path.push( sample.to_s )
  if architecture[sample].kind_of?(Array)
    @category_path.push( architecture[sample].sample )
  else
    random_category_path(architecture[sample])
  end
end

ActiveStorage::Attachment.all.each { |attachment| attachment.purge }
Order.all.delete_all
Record.all.delete_all
Room.all.delete_all
ProductsTag.all.delete_all
Boughtlist.all.delete_all
Product.all.delete_all

Tag.all.delete_all
User.all.delete_all


### TAG
@tag_array = []
traverse_category_architecture_to_array(category_architecture)
@tag_array.map! { |tag|
  [["name",tag]].to_h
}
Tag.create(@tag_array)

### USER
def user_img(slug)
  {io: open("https://robohash.org/#{slug}") , filename: slug+"_images.jpg"}
end
seller1 = User.create( email: "m95162000@yahoo.com.tw",password: "aaaaaa" ,password_confirmation: "aaaaaa" ,username: "趙小婷" ,role: "seller" )
seller1.avatar.attach(user_img(seller1.id.to_s))

seller2 = User.create( email: "m951620@yahoo.com.tw",password: "aaaaaa" ,password_confirmation: "aaaaaa" ,username: "秦小瑋" ,role: "seller" )
seller2.avatar.attach(user_img(seller2.id.to_s))

seller3 = User.create( email: "m95162011@yahoo.com.tw",password: "aaaaaa" ,password_confirmation: "aaaaaa" ,username: "趙小儒" ,role: "seller" )
seller3.avatar.attach(user_img(seller3.id.to_s))
seller = [seller1,seller2,seller3]


def product_imgg(url,name)
  {io: open(url) , filename: "#{name}_images.jpg"}
end

5.times do
  products_list.each do |prod|
    ### PRODUCT

    user = seller.sample
    product = Product.new( name: prod["name"],
                              description: prod["description"],
                              start_price: rand(100..500) ,
                              direct_price: rand(1000..10000),
                              user_id: user.id
                              )
    product.onshelf
    p prod["image"]
    prod["image"].each do |img,idx|
      product.images.attach(product_imgg(img,idx.to_s+prod["name"]))
    end
    product.save

    prod["tag"].each { |item|
      tag_id = Tag.find_by(name: item).id
      ProductsTag.create(product_id: product.id, tag_id: tag_id)
    }
    #ROOM
    r = Room.new(start_time: Time.now+ 30.seconds,
                end_time: Faker::Time.between_dates(from: Date.today+300, to: Date.today + 365, period: :all),
                product_id: product.id,
                id: product.id,
                status: %w[未開賣 開賣中 結束競標].sample,
                maxpeople: rand(10..100))
    r.save
  end
end

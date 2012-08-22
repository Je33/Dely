# encoding: utf-8
class Partner::SpecialsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :breds, :title_set
  layout 'partner'
  #def ordersCount
    #@bred=[]
    #@bred[0]=['Заказов('+role_orders.count.to_s+')',partner_orders_path]
  #end

  def title_set
    @title = "Svek.la {свекла}"
    @descr = "Svek.la {свекла} это новый удобный способ заказывать любимую еду и получать за это подарки."
    @title = "Личный кабинет | " + @title
  end

  def index

   @title = "Акции | " + @title

   #params[:place_id]
   @specials=Place.find(params[:place_id]).specials
   @partner_bred=[]
   @partner_bred[0]=['Рестораны','/partner/places']
   @partner_bred[1]=[Place.find(params[:place_id]).name,edit_partner_place_path(params[:place_id])]
   @partner_bred[2]=['Акции', partner_place_specials_path(params[:place_id])]
  end

  def new

    @title = "Новая акция | " + @title

    @special=Special.new
    @items=[]
    @specials_items_id=[]
    Special.where(:place_id=>params[:place_id]).map{|id| @specials_items_id<<id.item_id}
    if @specials_items_id!=[]
    Item.where('section_id IN (?) and id NOT IN (?)',Section.where(:place_id=>(params[:place_id])).map{|sect| sect.id},@specials_items_id).map{|i| @items<<[i.name,i.id]}
    else
      Item.where('section_id IN (?)',Section.where(:place_id=>(params[:place_id])).map{|sect| sect.id}).map{|i| @items<<[i.name,i.id]}
    end
    if @items==[]   #Нет ни одного товара для акции все заняты
      flash[:notice] = 'Нет товаров для акции (все заняты) )'
      redirect_to  partner_place_specials_path(params[:place_id])
    end
   # render :json=>{:items=>@items,:specials_items_id=>@specials_items_id}
  end

  def showPic
     @item=Item.find(params[:id])
     render '_showpic',:layout=>'nil'
  end

  def create
    @special = Special.new(params[:special])
    @special.place_id=params[:place_id]
    if params[:price]!=nil and  params[:price]!=''
      Item.find(params[:special][:item_id]).update_attributes({
        :price=>params[:price]
                                                            })
    end
    if @special.save
      flash[:notice] = 'Акция добавлена'
      redirect_to  partner_place_specials_path
    else
      flash[:notice] = 'Акция не добавлена, заполните обязательные поля'
      redirect_to  new_partner_place_special_path
    end
  end

  def edit
    @special = Special.find(params[:id])

    @title = @special.name.to_s + " | " + @title

    @items = []
    @items << [@special.item.name,@special.item.id]
    #render :text=>'wtf'
    @partner_bred=[]
    @partner_bred[0]=['Рестораны','/partner/places']
    @partner_bred[1]=[Place.find(params[:place_id]).name,edit_partner_place_path(params[:place_id])]
    @partner_bred[2]=['Акции', partner_place_specials_path(params[:place_id])]
    @partner_bred[3]=[@special.name,   edit_partner_place_special_path(params[:place_id],params[:id])]


  end

  def update
    @special = Special.find(params[:id])
    @special.update_attributes(params[:special])
    if params[:price]!=nil and  params[:price]!=''
    Item.find(@special.item_id).update_attributes({
                                                                :price=>params[:price]
                                                            })
    end
    if @special.save
      flash[:notice] =  'saved'
      redirect_to  partner_place_specials_path(params[:place_id])
    else
      flash[:notice] =  'not saved'
      redirect_to  partner_place_specials_path(params[:place_id])
    end
  end

  def destroy
    if Special.delete_all(:id=>params[:id])
      flash[:notice] = 'Акция удалена'
    end
    redirect_to  partner_place_specials_path(params[:place_id])
  end
end

#encoding: utf-8
class Partner::ItemsController < ApplicationController
  layout 'partner'
  before_filter :authenticate_user!
  before_filter :breds
  before_filter :admins
  before_filter :not_operators, :title_set

  def title_set
    @title = "Svek.la {свекла}"
    @descr = "Svek.la {свекла} это новый удобный способ заказывать любимую еду и получать за это подарки."
    @title = "Личный кабинет | " + @title
  end

  def index
    @title = "Товары | " + @title
    @items = Item.where(:section_id => params[:section_id])
    @partner_bred=[]
    @partner_bred[0]=['Рестораны','/partner/places']
    @partner_bred[1]=[Place.find(params[:place_id]).name,edit_partner_place_path(params[:place_id])]
    @partner_bred[2]=['Категории', partner_place_sections_path(params[:place_id])]
    @partner_bred[3]=[Section.find( params[:section_id]).name, edit_partner_place_section_path(params[:place_id],params[:section_id])]
    @partner_bred[4]=['Товары',  partner_place_section_items_path(params[:place_id],params[:section_id])]
  end

  def new
    @title = "Новый товар | " + @title
    @item=Item.new
  end

  def create
    @item = Item.new(params[:item])

    @item.section_id=params[:section_id]

    if @item.save
      Section.find(params[:section_id]).update_attributes(:cnt => Section.find(params[:section_id]).cnt.to_i+1)
      flash[:notice] = 'Item was successfully created.'
      redirect_to :back#'/places/'#+Section.find(@item.section_id.to_s).id.to_s+'/'+@item.section_id.to_s
    else
      flash[:notice] = 'Item was not successfully created.'
      redirect_to :back #'/places/'#+Section.find(@item.section_id.to_s).id.to_s+'/'+@item.section_id.to_s
    end
  end

  def show
    @item = Item.find(params[:id])
    @title = @item.name + " | " + @title
  end

  def edit
    @item = Item.find(params[:id])
    @title = @item.name + " | " + @title
    @partner_bred=[]
    @partner_bred[0]=['Рестораны','/partner/places']
    @partner_bred[1]=[Place.find(params[:place_id]).name,edit_partner_place_path(params[:place_id])]
    @partner_bred[2]=['Категории', partner_place_sections_path(params[:place_id])]
    @partner_bred[3]=[Section.find( params[:section_id]).name, edit_partner_place_section_path(params[:place_id],params[:section_id])]
    @partner_bred[4]=['Товары',  partner_place_section_items_path(params[:place_id],params[:section_id])]
    @partner_bred[5]=[@item.name,   edit_partner_place_section_item_path(params[:place_id],params[:section_id],params[:id])]
  end

  def update
    @item = Item.find(params[:id])
    @item.update_attributes(params[:item])

    if @item.save
      flash[:notice] =  'saved'
          redirect_to  partner_place_section_items_path(params[:place_id],params[:section_id])
    else
      flash[:notice] =  'not saved'
      redirect_to  partner_place_section_items_path(params[:place_id],params[:section_id])
    end
  end

  #def delete
  def destroy
    if Item.delete_all(:id=>params[:id])
      Section.find(params[:section_id]).update_attributes(:cnt => Section.find(params[:section_id]).cnt.to_i-1)
      flash[:notice] = 'Item was successfully deleted.'
    end
    redirect_to  partner_place_section_items_path(params[:place_id],params[:section_id])
  end


end

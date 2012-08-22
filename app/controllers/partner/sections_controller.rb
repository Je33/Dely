#encoding: utf-8
class Partner::SectionsController < ApplicationController
  layout 'partner'
  before_filter :authenticate_user!
  before_filter :admins
  before_filter :breds, :title_set

  def title_set
    @title = "Svek.la {свекла}"
    @descr = "Svek.la {свекла} это новый удобный способ заказывать любимую еду и получать за это подарки."
    @title = "Личный кабинет | " + @title
  end

  def new
    @title = "Новая категория | " + @title
    @section=Section.new
  end

  def index

    @title = "Категории | " + @title

    #render :json=>{:id=>params}
    @sections = Section.where(:place_id => params[:place_id])
    @partner_bred=[]
    @partner_bred[0]=['Рестораны','/partner/places']
    @partner_bred[1]=[Place.find(params[:place_id]).name,edit_partner_place_path(params[:place_id])]
    @partner_bred[2]=['Категории', partner_place_sections_path(params[:place_id])]
  end

  def show
    id=params[:id]
    @section=Section.find(id)

    @title = @section.name.to_s + " | " + @title

    @items=Item.where(:section_id=>id)
    @partner_bred=[]
    @partner_bred[0]=['Рестораны','/partner/places']
    @partner_bred[1]=[Place.find(params[:place_id]).name,edit_partner_place_path(params[:place_id])]
    @partner_bred[2]=['Категории', partner_place_sections_path(params[:place_id])]
    @partner_bred[3]=[@section.name, edit_partner_place_section_path(params[:id])]
  end

  def edit
    @section = Section.find(params[:id])

    @title = @section.name.to_s + " | " + @title

    @partner_bred=[]
    @partner_bred[0]=['Рестораны','/partner/places']
    @partner_bred[1]=[Place.find(params[:place_id]).name,edit_partner_place_path(params[:place_id])]
    @partner_bred[2]=['Категории', partner_place_sections_path(params[:place_id])]
    @partner_bred[3]=[@section.name, edit_partner_place_section_path(params[:place_id],params[:id])]
  end

  def update
    @section = Section.find(params[:id])
    if @section.update_attributes(params[:section])
      redirect_to partner_place_sections_url(params[:place_id]), notice: 'Section was successfully updated.'
    else
      render action: "edit"
    end
  end


  def create
    @section = Section.new(params[:section])
    @section.active=0
    @section.place_id=params[:place_id]
    if @section.save
      flash[:notice] = 'Section was successfully created.'
       redirect_to  partner_place_sections_path(params[:place_id])
    else
      flash[:notice] = 'Section was not successfully created.'
       redirect_to  partner_place_sections_path(params[:place_id])
    end
  end

  def destroy
    @section = Section.find(params[:id])
   # @section.delit
    @section.destroy
    redirect_to partner_place_sections_path(params[:place_id])
  end

end

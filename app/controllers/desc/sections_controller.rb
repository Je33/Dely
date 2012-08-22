# encoding: utf-8
class Desc::SectionsController < ApplicationController

  before_filter :global_admins, :breadcrumbs
  layout 'desc'

  def breadcrumbs
    partner = Partner.find(params[:partner_id])
    place = Place.find(params[:place_id])
    @bread = [['Главная', '/desc'], ['Партнеры', desc_partners_path], [partner.name, edit_desc_partner_path(partner.id)], ['Заведения', desc_partner_places_path(params[:partner_id])], [place.name, edit_desc_partner_place_path(params[:partner_id], params[:place_id])], ['Меню', desc_partner_place_sections_path(params[:place_id])]]
  end

  def index
    @sections = Section.where(:place_id => params[:place_id])
    if params[:f] && params[:d]
      @sections = @sections.order(params[:f] + " " + params[:d])
    else
      @sections = @sections.all
    end
  end

  def show
    @section = Section.find(params[:id])
    @bread << [@section.name]
  end

  def new
    @bread << ['New']
    @section = Section.new
  end

  def edit
    @section = Section.find(params[:id])
    @bread << [@section.name]
  end

  def create
    @section = Section.new(params[:section])
    @section.place_id = params[:place_id]
    if @section.save
      redirect_to desc_partner_place_sections_url(params[:partner_id], params[:place_id]), notice: 'Section was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @section = Section.find(params[:id])
    if @section.update_attributes(params[:section])
      redirect_to desc_partner_place_sections_url(params[:partner_id], params[:place_id]), notice: 'Section was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @section = Section.find(params[:id])
    @section.delete
    redirect_to desc_partner_place_sections_url(params[:partner_id], params[:place_id])
  end

end

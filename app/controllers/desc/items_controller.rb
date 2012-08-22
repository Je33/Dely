# encoding: utf-8
class Desc::ItemsController < ApplicationController

  before_filter :global_admins, :breadcrumbs
  layout 'desc'

  def breadcrumbs
    partner = Partner.find(params[:partner_id])
    place = Place.find(params[:place_id])
    section = Section.find(params[:section_id])
    @bread = [['Главная', '/desc'], ['Партнеры', desc_partners_path], [partner.name, edit_desc_partner_path(partner.id)], ['Заведения', desc_partner_places_path(params[:partner_id])], [place.name, edit_desc_partner_place_path(params[:partner_id], params[:place_id])], ['Меню', desc_partner_place_sections_path(params[:partner_id], params[:place_id])], [section.name, edit_desc_partner_place_section_path(partner.id, place.id, section.id)], ['Товары', desc_partner_place_section_items_path(params[:partner_id], params[:place_id], params[:section_id])]]
  end

  def index
    @items = Item.where(:section_id => params[:section_id])
    if params[:f] && params[:d]
      @items = @items.order(params[:f] + " " + params[:d])
    else
      @items = @items.all
    end
  end

  def show
    @item = Item.find(params[:id])
    @bread << [@item.name]
  end

  def new
    @bread << ['New']
    @item = Item.new
  end

  def edit
    @item = Item.find(params[:id])
    @bread << [@item.name]
  end

  def create
    @item = Item.new(params[:item])
    @item.section_id = params[:section_id]
    if @item.save
      redirect_to desc_partner_place_section_items_url(params[:partner_id], params[:place_id], params[:section_id]), notice: 'Item was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @item = Item.find(params[:id])
    if @item.update_attributes(params[:item])
      redirect_to desc_partner_place_section_items_url(params[:partner_id], params[:place_id], params[:section_id]), notice: 'Item was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @item = Item.find(params[:id])
    @item.destroy
    redirect_to desc_partner_place_section_items_url(params[:partner_id], params[:place_id], params[:section_id])
  end
end

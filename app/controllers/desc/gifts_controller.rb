# encoding: utf-8
class Desc::GiftsController < ApplicationController

  before_filter :global_admins, :breadcrumbs
  layout 'desc'

  def breadcrumbs
    gift_section = GiftSection.find(params[:gift_section_id])
    @bread = [['Главная', '/desc'], ['Разделы призов', desc_gift_sections_path], [gift_section.name, edit_desc_gift_section_path(gift_section.id)], ['Призы', desc_gift_section_gifts_path(params[:gift_section_id])]]
  end

  def index
    @gifts = Gift.where(:gift_section_id => params[:gift_section_id])
    if params[:f] && params[:d]
      @gifts = @gifts.order(params[:f] + " " + params[:d])
    else
      @gifts = @gifts.all
    end
  end

  def show
    @gift = Gift.find(params[:id])
    @bread << [@gift.name]
  end

  def new
    @bread << ['Новый приз']
    @gift = Gift.new
  end

  def edit
    @gift = Gift.find(params[:id])
    @bread << [@gift.name]
  end

  def create
    @gift = Gift.new(params[:gift])
    @gift.gift_section_id = params[:gift_section_id]
    if @gift.save
      redirect_to desc_gift_section_gifts_url(params[:gift_section_id]), notice: 'Gift was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @gift = Gift.find(params[:id])
    if @gift.update_attributes(params[:gift])
      redirect_to desc_gift_section_gifts_url(params[:gift_section_id]), notice: 'Gift was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @gift = Gift.find(params[:id])
    @gift.destroy
    redirect_to desc_gift_section_gifts_url(params[:gift_section_id])
  end

end

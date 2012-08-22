# encoding: utf-8
class Desc::GiftSectionsController < ApplicationController

  before_filter :global_admins, :breadcrumbs
  layout 'desc'

  def breadcrumbs
    @bread = [['Главная', '/desc'], ['Разделы призов', desc_gift_sections_path]]
  end

  def index
    if params[:f] && params[:d]
      @gift_sections = GiftSection.order(params[:f] + " " + params[:d])
    else
      @gift_sections = GiftSection.all
    end
  end

  def show
    @gift_section = GiftSection.find(params[:id])
    @bread << [@gift_section.name]
  end

  def new
    @bread << ['Новый раздел']
    @gift_section = GiftSection.new
  end

  def edit
    @gift_section = GiftSection.find(params[:id])
    @bread << [@gift_section.name]
  end

  def create
    @gift_section = GiftSection.new(params[:gift_section])
    if @gift_section.save
      redirect_to desc_gift_sections_url, notice: 'Gift section was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @gift_section = GiftSection.find(params[:id])
    if @gift_section.update_attributes(params[:gift_section])
      redirect_to desc_gift_sections_url, notice: 'Gift section was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @gift_section = GiftSection.find(params[:id])
    @gift_section.destroy
    redirect_to desc_gift_sections_url
  end

end

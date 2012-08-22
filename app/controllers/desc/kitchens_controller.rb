# encoding: utf-8
class Desc::KitchensController < ApplicationController

  before_filter :global_admins, :breadcrumbs
  layout 'desc'

  def breadcrumbs
    @bread = [['Главная', '/desc'], ['Кухни', desc_kitchens_path]]
  end

  def index
    if params[:f] && params[:d]
      @kitchens = Kitchen.order(params[:f] + " " + params[:d])
    else
      @kitchens = Kitchen.all
    end
  end

  def show
    @kitchen = Kitchen.find(params[:id])
  end

  def new
    @kitchen = Kitchen.new
  end

  def edit
    @kitchen = Kitchen.find(params[:id])
  end

  def create
    @kitchen = Kitchen.new(params[:kitchen])
    if @kitchen.save
      redirect_to desc_kitchens_url, notice: 'Kitchen was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @kitchen = Kitchen.find(params[:id])
    if @kitchen.update_attributes(params[:kitchen])
      redirect_to desc_kitchens_url, notice: 'Kitchen was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @kitchen = Kitchen.find(params[:id])
    @kitchen.destroy
    redirect_to desc_kitchens_url
  end
end

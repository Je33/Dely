# encoding: utf-8
class Desc::SpecialsController < ApplicationController

  before_filter :global_admins, :breadcrumbs
  layout 'desc'

  def breadcrumbs
    @bread = [['Главная', '/desc'], ['Акции', desc_specials_path]]
  end

  def index
    if params[:f] && params[:d]
      @specials = Special.order(params[:f] + " " + params[:d])
    else
      @specials = Special.all
    end
  end

  def show
    @special = Special.find(params[:id])
  end

  def new
    @special = Special.new
  end

  def edit
    @special = Special.find(params[:id])
  end

  def create
    @special = Special.new(params[:special])
    if @special.save
      redirect_to desc_specials_url, notice: 'Акция добавлена'
    else
      render action: "new"
    end
  end

  def update
    @special = Special.find(params[:id])
    if @special.update_attributes(params[:special])
      redirect_to desc_specials_url, notice: 'Акция обновлена'
    else
      render action: "edit"
    end
  end

  def destroy
    @special = Special.find(params[:id])
    @special.destroy
    redirect_to desc_specials_url
  end
end

# encoding: utf-8
class Desc::CitiesController < ApplicationController

  before_filter :global_admins, :breadcrumbs
  layout 'desc'

  def breadcrumbs
    @bread = [['Главная', '/desc'], ['Города', desc_cities_path]]
  end

  def index
    if params[:f] && params[:d]
      @cities = City.order(params[:f] + " " + params[:d])
    else
      @cities = City.all
    end
  end

  def show
    @city = City.find(params[:id])
  end

  def new
    @city = City.new
  end

  def edit
    @city = City.find(params[:id])
  end

  def create
    @city = City.new(params[:city])
    if @city.save
      redirect_to desc_cities_url, notice: 'City was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @city = City.find(params[:id])
    if @city.update_attributes(params[:city])
      redirect_to desc_cities_url, notice: 'City was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @city = City.find(params[:id])
    @city.destroy
    redirect_to desc_cities_url
  end
end

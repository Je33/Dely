# encoding: utf-8
class Desc::RegionsController < ApplicationController

  before_filter :global_admins, :breadcrumbs
  layout 'desc'

  def breadcrumbs
    city = City.find(params[:city_id])
    @bread = [['Главная', '/desc'], ['Города', desc_cities_path], [city.name, edit_desc_city_path(city.id)], ['Районы', desc_city_regions_path(city.id)]]
  end

  def index
    if params[:f] && params[:d]
      @regions = Region.order(params[:f] + " " + params[:d])
    else
      @regions = Region.all
    end
  end

  def show
    @region = Region.find(params[:id])
  end

  def new
    @region = Region.new
  end

  def edit
    @region = Region.find(params[:id])
  end

  def create
    @region = Region.new(params[:region])
    @region.city_id = params[:city_id]
    if @region.save
      redirect_to desc_city_regions_url(params[:city_id]), notice: 'Region was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @region = Region.find(params[:id])
    if @region.update_attributes(params[:region])
      redirect_to desc_city_regions_url(params[:city_id]), notice: 'Region was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @region = Region.find(params[:id])
    @region.destroy
    redirect_to desc_city_regions_url(params[:city_id])
  end
end

# encoding: utf-8
class Desc::MetrosController < ApplicationController

  before_filter :global_admins, :breadcrumbs
  layout 'desc'

  def breadcrumbs
    city = City.find(params[:city_id])
    @bread = [['Главная', '/desc'], ['Города', desc_cities_path], [city.name, edit_desc_city_path(city.id)], ['Метро', desc_city_metros_path(city.id)]]
  end

  def index
    if params[:f] && params[:d]
      @metros = Metro.order(params[:f] + " " + params[:d])
    else
      @metros = Metro.all
    end
  end

  def show
    @metro = Metro.find(params[:id])
  end

  def new
    @metro = Metro.new
  end

  def edit
    @metro = Metro.find(params[:id])
  end

  def create
    @metro = Metro.new(params[:region])
    @metro.city_id = params[:city_id]
    if @metro.save
      redirect_to desc_citiy_metros_url(params[:city_id]), notice: 'Metro was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @metro = Metro.find(params[:id])
    if @metro.update_attributes(params[:region])
      redirect_to desc_city_metros_url(params[:city_id]), notice: 'Metro was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @metro = Metro.find(params[:id])
    @metro.destroy
    redirect_to desc_city_metros_url(params[:city_id])
  end
end

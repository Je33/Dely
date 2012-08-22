# encoding: utf-8
class Desc::PlacesController < ApplicationController

  before_filter :global_admins, :breadcrumbs
  layout 'desc'

  def breadcrumbs
    partner = Partner.find(params[:partner_id])
    @bread = [['Главная', '/desc'], ['Партнеры', '/desc/partners'], [partner.name, edit_desc_partner_path(partner.id)], ['Заведения', desc_partner_places_path(params[:partner_id])]]
  end

  def index
    @places = Place.where(:partner_id => params[:partner_id])
    if params[:f] && params[:d]
      @places = @places.order(params[:f] + " " + params[:d])
    else
      @places = @places.all
    end
  end

  def show
    @place = Place.find(params[:id])
    @bread << [@place.name]
  end

  def new
    @bread << ['New']
    @place = Place.new
  end

  def edit
    @place = Place.find(params[:id])
    @bread << [@place.name]
  end

  def create
    if params[:place][:rating_minus].to_i > 0
      params[:place][:rating_minus] = params[:place][:rating_minus].to_i * -1
    end
    if params[:place][:rating_minus].to_i + params[:place][:rating_plus].to_i == 0
      params[:place][:rating] = 0
    else
      params[:place][:rating] = ((params[:place][:rating_plus].to_f / (params[:place][:rating_minus].to_f.abs + params[:place][:rating_plus].to_f.abs)) * 100).round
    end
    @place = Place.new(params[:place])
    @place.partner_id = params[:partner_id]
    if @place.save
      if params[:delivery]
        case params[:delivery]
          when "free"
            DeliveryPrice.where(:place_id => params[:id]).destroy_all
          when "region"
            DeliveryPrice.where(:place_id => params[:id]).destroy_all
            params[:delivery_region_new].each do |k, drn|
              if drn[:price] && drn[:price] != ""
                DeliveryPrice.create({:place_id => params[:id], :condition => "region", :price => drn[:price], :region_id => drn[:region]})
              end
            end
        end
      end
      redirect_to desc_partner_places_url(params[:partner_id]), notice: 'Place was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @place = Place.find(params[:id])
    if params[:place][:rating_minus].to_i > 0
      params[:place][:rating_minus] = params[:place][:rating_minus].to_i * -1
    end
    if params[:place][:rating_minus].to_i + params[:place][:rating_plus].to_i == 0
      params[:place][:rating] = 0
    else
      params[:place][:rating] = ((params[:place][:rating_plus].to_f / (params[:place][:rating_minus].to_f.abs + params[:place][:rating_plus].to_f.abs)) * 100).round
    end
    if params[:delivery]
      case params[:delivery]
        when "free"
          DeliveryPrice.where(:place_id => params[:id]).destroy_all
        when "region"
          DeliveryPrice.where(:place_id => params[:id]).destroy_all
          params[:delivery_region_new].each do |k, drn|
            if drn[:price] && drn[:price] != ""
              DeliveryPrice.create({:place_id => params[:id], :condition => "region", :price => drn[:price], :region_id => drn[:region]})
            end
          end
      end
    end
    if @place.update_attributes(params[:place])
      redirect_to desc_partner_places_url(params[:partner_id]), notice: 'Place was successfully updated.'
      #render :json => params
    else
      render action: "edit"
    end
  end

  def destroy
    @place = Place.find(params[:id])
    users=[]
    @place.place_accesses.map{|p| users << p.user_id}
    @place.destroy
    users.each do |u|
      setUserAccess u
    end

    redirect_to desc_partner_places_url(params[:partner_id])
  end

end

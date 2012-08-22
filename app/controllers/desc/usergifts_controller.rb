# encoding: utf-8
class Desc::UsergiftsController < ApplicationController

  before_filter :global_admins, :breadcrumbs
  layout 'desc'

  def breadcrumbs
    @bread = [['Главная', '/desc'], ['Заявки на подарки', desc_usergifts_path]]
  end

  def index
    if params[:f] && params[:d]
      @usergifts = Usergift.order(params[:f] + " " + params[:d])
    else
      @usergifts = Usergift.all
    end
  end

  def show
    @usergift = Usergift.find(params[:id])
  end

  def new
    @usergift = Usergift.new
  end

  def edit
    @usergift = Usergift.find(params[:id])
  end

  def create
    @usergift = Usergift.new(params[:usergift])
    if @usergift.save
      redirect_to desc_usergifts_url, notice: 'User gift was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @usergift = Usergift.find(params[:id])
    if @usergift.update_attributes(params[:usergift])
      redirect_to desc_usergifts_url, notice: 'User gift was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @usergift = Usergift.find(params[:id])
    @usergift.destroy
    redirect_to desc_usergifts_url
  end
end

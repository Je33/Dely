# encoding: utf-8
class Desc::PopularsController < ApplicationController

  before_filter :global_admins, :breadcrumbs
  layout 'desc'

  def breadcrumbs
    @bread = [['Главная', '/desc'], ['Популярные теги', desc_populars_path]]
  end

  def index
    if params[:f] && params[:d]
      @populars = Popular.order(params[:f] + " " + params[:d])
    else
      @populars = Popular.all
    end
  end

  def show
    @popular = Popular.find(params[:id])
  end

  def new
    @popular = Popular.new
  end

  def edit
    @popular = Popular.find(params[:id])
  end

  def create
    @popular = Popular.new(params[:popular])
    if @popular.save
      redirect_to desc_populars_url, notice: 'Popular was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @popular = Popular.find(params[:id])
    if @popular.update_attributes(params[:popular])
      redirect_to desc_populars_url, notice: 'Popular was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @popular = Popular.find(params[:id])
    @popular.destroy
    redirect_to desc_populars_url
  end
end

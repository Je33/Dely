# encoding: utf-8
class Desc::UsersController < ApplicationController

  before_filter :global_admins
  layout 'desc'

  def index
    @bread = [['Главная', '/desc'], ['Пользователи', '/desc/users']]
    if params[:place].to_i > 0
      ids = Place.find(params[:place]).place_accesses.pluck(:user_id)
      @users = User.where(:id => ids)
    else
      @users = User.where(:access => params[:u].to_i)
    end
    if params[:f] && params[:d]
      @users = @users.order(params[:f] + " " + params[:d])
    else
      @users = @users.all
    end
    respond_to do |format|
      format.html # index.html
    end
  end

  def show
    @user = User.find(params[:id])

    respond_to do |format|
      format.html # show.html.haml
    end
  end

  def new
    @user = User.new
  end

  def edit
    @user = User.find(params[:id])
  end

  def create
    params[:user][:phone] = "+7 " + params[:user][:phone].to_s
    @user = User.new(params[:user])
    respond_to do |format|
      if @user.save
        if params[:user][:access] == "1" || params[:user][:access] == "2"
          if params[:user_partner_places] != nil && params[:user_partner_places][0] != nil
            params[:user_partner_places].each do |p|
              PlaceAccess.create({:place_id => p, :user_id => @user.id, :access => params[:user][:access]})
            end
          end
        end
        format.html { redirect_to desc_users_path + '?u=' + params[:user][:access], notice: 'User was successfully created.' }
      else
        format.html { render action: "new" }
      end
    end
  end

  def update
    @user = User.find(params[:id])
    params[:user][:phone] = "+7 " + params[:user][:phone].to_s
    @user.place_accesses.destroy_all
    if params[:user][:access] == "1" || params[:user][:access] == "2"
      if params[:user_partner_places] != nil && params[:user_partner_places][0] != nil
        params[:user_partner_places].each do |p|
          PlaceAccess.create({:place_id => p, :user_id => @user.id, :access => params[:user][:access]})
        end
      end
    end
    respond_to do |format|
      if @user.update_attributes(params[:user])
        format.html { redirect_to desc_users_path + '?u=' + params[:user][:access], notice: 'User was successfully updated.' }
      else
        format.html { render action: "edit" }
      end
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
    respond_to do |format|
      format.html { redirect_to desc_users_url }
    end
  end
end

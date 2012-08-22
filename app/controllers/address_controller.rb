# encoding: utf-8
class AddressController < ApplicationController
  def index
    #id=params[:id]

  end

  def new
    @metros=Metro.where(:city_id=>current_user.city_id).map {|m| [m.name,m.id]}
    @address=Address.find_by_user_id(current_user.id)
  end

  def save
    metro_id=params[:metro][:id]
    street=params[:street]
    house=params[:house]
    building=params[:house]
    room=params[:room]
    porch=params[:porch]
    floor=params[:floor]
    intercom=params[:intercom]
    description=params[:description]
    flash[:notice]=[]
    if street==''
      flash[:notice]<<'Поле улица обязательно к заполнению <br />'
    end
    if house==''
      flash[:notice]<<'Поле дом обязательно к заполнению <br />'
    end
    if  street!='' and house!=''
      #Сохраняем
    @user=User.find(current_user.id)
    @user.metro_id=metro_id
    @user.save


      if Address.exists?(:user_id=> current_user.id)
          @address=Address.find_by_user_id(current_user.id)
          @address.street=street
          @address.house=house
          @address.room=room
          @address.building=building
          @address.porch=porch
          @address.floor=floor
          @address.intercom=intercom
          @address.description=description
          @address.user_id=current_user.id
      else

        @address=Address.new
        @address.street=street
        @address.house=house
        @address.room=room
        @address.building=building
        @address.porch=porch
        @address.floor=floor
        @address.intercom=intercom
        @address.description=description
        @address.user_id=current_user.id
      end
          if  @address.save
            flash[:notice] ='Профиль обновлен'
            redirect_to '/my_profile?id='+current_user.id.to_s
          else
            flash[:notice] ='Поломки на линии'
            redirect_to '/my_profile?id='+current_user.id.to_s
          end
    else
         redirect_to '/address/new'
    end
   # render :json=>{:address=>@address,:user=>@user,:cur=>User.find(current_user.id),:fl=>flash[:notice]}

  end

end

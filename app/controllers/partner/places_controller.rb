# encoding: utf-8
class Partner::PlacesController < ApplicationController
  before_filter :authenticate_user!
  before_filter :admins
  before_filter :not_operators, :breds, :title_set
  layout 'partner'

  def title_set
    @title = "Svek.la {свекла}"
    @descr = "Svek.la {свекла} это новый удобный способ заказывать любимую еду и получать за это подарки."
    @title = "Личный кабинет | " + @title
  end

  def index
    @title = "Рестораны | " + @title
    places_id=partner_admin_places_id
    #@bred=[]
    @places=Place.find(places_id)
    #@bred[0]=['Заказов ('+role_orders.count.to_s+')',partner_orders_path]
   # render :json=>{:places_id=>places_id,:place_accesses=>current_user.place_accesses.first.place.partner.places,:cur_part=>current_user.partners}
    :part_brud

      @partner_bred=[]
      @partner_bred[0]=['Рестораны','/partner/places']

  end

  def new

    @title = "Новый ресторан | " + @title
    
     @place=Place.new

     if current_user.access==2
       @partners=[]
       current_user.partner.map{|p| @partners<<[p.name,p.id]}
       @partners<<[current_user.place_accesses.first.place.partner.name,current_user.place_accesses.first.place.partner.id]

     end

     if current_user.access==4
       @partners=Partner.all.map{|p| [p.name,p.id] }
     end

  end

  def edit
    
    partner_admin_places_id
    @place = Place.find(params[:id])

    @title = @place.name.to_s + " | " + @title

    @partner_bred=[]
    @partner_bred[0]=['Рестораны','/partner/places']
    @partner_bred[1]=[@place.name,edit_partner_place_path(@place.id)]


  end


def create

  @place = Place.new(params[:place])

  if @place.save
    redirect_to partner_places_path, notice: 'Place was successfully created.'
    if current_user.access==2
       PlaceAccess.create({
           :place_id=>@place.id,
           :user_id=>current_user.id,
           :access=>2
                          })
    end
  else
    render action: "new"
  end
end


  def update
    partner_admin_places_id
    @place = Place.find(params[:id])
    if @place.update_attributes({
        :description=>params[:place][:description]})
      redirect_to partner_places_url, notice: 'Успешно обновлено.'
    else
      render action: "edit"
    end
  end

  def destroy
    #partner_admin_places_id
    flash[:notice]='Удалять рестораны нельзя!'
    #@place = Place.find(params[:id])
    #@place.destroy
    redirect_to partner_places_url

  end

  def show
    id=params[:id]
    @place=Place.find(id)
    @title = @place.name.to_s + " | " + @title
    @sections=Section.where(:place_id=>id)
  end

def options
  @title = "Настройки | " + @title
  not_operators
  @places_id=partner_admin_places_id
  @place_acceses=PlaceAccess.where('(user_id > 0) and (place_id IN (?))',@places_id)
  @operators=[]
    @place_acceses.where('access IN (1,2)').select("user_id").all.map{|u| u.user_id}.uniq.each do |o|
         if User.exists?(o)
           @operators << o
         end
    end
  @place_acceses=@place_acceses.where('user_id  IN (?)',@operators)
  #@bred=[]
  @places=Place.find(@places_id)
  #@bred[0]=['Заказов ('+role_orders.count.to_s+')',partner_orders_path]

  @partner_bred=[]
  @partner_bred[0]=['Настройки','/partner/options']
end

  def delete_user
    partner_admin
    PlaceAccess.delete_all(:user_id=>params[:user_id],:place_id=>params[:place_id])

    setUserAccess params[:user_id]
    redirect_to  partner_options_path
  end


  def ajaxOptions
    if current_user.partner
      @partner= current_user.partner
    else
      @places_id=partner_admin_places_id
      @partner=Place.where(:id=>@places_id).first.partner
    end


      if @partner
        render '_alertsoptions',:layout => 'nil'
      else
        #render :text=>'Партнера для данного заведения не найдено'
        render :json=>{:places_id=>@places_id,:partner=>Partner.where(:place_id=>@places_id)}
      end
  end


  def ajaxOptionsUsers
    @places_id=partner_admin_places_id
    @place_acceses=PlaceAccess.where('(user_id > 0) and (place_id IN (?))',@places_id)
    @operators=[]
    @place_acceses.where('access IN (1,2)').select("user_id").all.map{|u| u.user_id}.uniq.each do |o|
      if User.exists?(o)
        @operators << o
      end
    end
    @place_acceses=@place_acceses.where('user_id  IN (?)',@operators)



     render '_useroption',:layout => 'nil'
  end

  def ajaxUserEdit
    @u=User.find(params[:user_id])
    @place_id=params[:place_id]
    render '_useredit',:layout => 'nil'

  end

  def ajaxhistory
    @logs=Log.where('id>0')
    if params[:ids] or params[:ops]
      @checked=params[:ids].split(':')
      @ops=params[:ops].split(':')
      if  @checked.count > 1
        @checked=@checked.drop(1)
        @logs=@logs.where(:status_id => @checked)
      end

      if  @ops.count > 1
        @ops=@ops.drop(1)
        @logs=@logs.where(:user_id=>@ops)
      end
    end
    if params[:user_id]!=nil and params[:user_id]!=''
      @logs=@logs.where(:user_id=>params[:user_id])
      @user=User.find(params[:user_id])
    end
    render 'allhistory',:layout=>'nil'
  end

  def accordion
    render 'accordion',:layout=>'nil'
  end

  def ajaxUserSave
    @user=User.find(params[:user_id])
    if params[:user][:first_name]
      @user.update_attributes({
                                  :first_name=> params[:user][:first_name]
                               })
    end

    if params[:user][:last_name]
      @user.update_attributes({
                                  :last_name=> params[:user][:last_name]
                              })
    end

    if params[:user][:phone]
      @user.update_attributes({
                                  :phone=> '+7 '+params[:user][:phone]
                              })
    end

    if params[:user][:password]
      @user.update_attributes({
                                  :password=> params[:user][:password]
                              })
    end
    if params[:add_user_select]
      if params[:add_user_select][:role]

      if PlaceAccess.exists?(:user_id=>params[:user_id],:place_id=>params[:place_id])
        if PlaceAccess.exists?(:user_id=>params[:user_id],:place_id=>params[:place_id],:access=>params[:add_user_select][:role])
          PlaceAccess.where('user_id= ? AND place_id = ? AND  access != ?',params[:user_id],params[:place_id],params[:add_user_select][:role]).delete_all
        else
          PlaceAccess.where(:user_id=>params[:user_id],:place_id=>params[:place_id]).first.update_attributes({
            :access=> params[:add_user_select][:role]
          })
        end

      else
        PlaceAccess.create({
                          :access=> params[:add_user_select][:role],
                          :user_id=>params[:user_id],
                          :place_id=>params[:place_id]
                      })
      end
      end
    end
    if params[:commit]=='Удалить пользователя'
      PlaceAccess.delete_all(:user_id=>params[:user_id],:place_id=>params[:place_id])
    end
    setUserAccess  @user.id
    redirect_to '/partner/options'
  end

def addUser

  not_operators
  @places_id=partner_admin_places_id
  @place_acceses=PlaceAccess.where(:place_id=>@places_id)
  @places=[]
  if params[:exist_user_phone]  and params[:radio1]=='1'
     if User.exists?(:phone => ('+7 ' + params[:exist_user_phone]))
        user = User.find_by_phone('+7 ' +params[:exist_user_phone])
        if user.access != 0 then
          flash[:notice] = 'Этот номер привязан к другому ресторану'
          redirect_to  partner_options_addUser_path
        else
          params[:add_user_select][:place].each do |place_id|
            if  place_id!='' and place_id!=nil
              if PlaceAccess.exists?(:user_id=>user.id,:place_id=>place_id,:access=>params[:add_user_select][:role])
              else
                PlaceAccess.create({
                                       :user_id=>user.id,
                                       :place_id=>place_id,
                                       :access=>params[:add_user_select][:role]
                                   })
              end
            end
          end
          #роль юзера
          setUserAccess user.id
          flash[:notice]='Добавлено'
          redirect_to  '/partner/options'
        end
     else
       flash[:notice] = 'такого пользователя не существует'
       redirect_to  partner_options_addUser_path
     end
  end


  if params[:add_user_select] and params[:radio1]=='2'

    if params[:user][:phone].to_s =='' or params[:user][:first_name].to_s =='' or params[:user][:password].to_s ==''
      flash[:notice] = 'Введите все обязательные поля'
      #@new = 1
      redirect_to '/partner/options/addUser'
    else
      params[:user][:phone] = '+7 ' +  params[:user][:phone]
      if User.exists?(:phone=>params[:user][:phone])
        flash[:notice]='Такой телефон уже зарегестрирован в базе'
        #@new = 1
        redirect_to '/partner/options/addUser'

      else
        user=User.new({
                          :phone =>params[:user][:phone],
                          :first_name =>params[:user][:first_name],
                          :email =>params[:user][:email]
                      })
        user.password = params[:user][:password]
        user.save

        params[:add_user_select][:place].each do |place_id|
          if  place_id!='' and place_id != nil
            if PlaceAccess.exists?(:user_id=>user.id,:place_id=>place_id,:access=>params[:add_user_select][:role])
            else
              if user.id!=nil
                PlaceAccess.create({
                                       :user_id=>user.id,
                                       :place_id=>place_id,
                                       :access=>params[:add_user_select][:role]
                                   })
              end
            end
          end
        end
        #роль юзера
        flash[:notice]='Добавлено'
        if user.id!=nil
          setUserAccess user.id
        end
        redirect_to  '/partner/options'
      end
    end
  else
    @places=Place.where(:id=> @places_id).map{|p| [p.name,p.id]}
  end


  if @places!=[]  and  @places!=nil
    @place_acceses=PlaceAccess.where(:place_id=>partner_admin_places_id).map{|p| p.user_id}
    @place_acceses << Place.where(:id=>partner_admin_places_id).first.partner.user_id
    #@u=User.where('id NOT IN (?) and access!=4',@place_acceses).map{|u| [u.first_name+' '+u.last_name,u.id]}
    @u=User.where('id > 0 and access!=4 and id!=?',current_user.id).map{|u| [u.first_name+' '+u.last_name,u.id]}
  else
    @u=[current_user.first_name+' '+current_user.last_name,current_user.id]
  end

  if @u==[] or @u==nil
     flash[:notice]='Нет доступных пользователей'
     #redirect_to '/partner/options'
  end

  #render :json=>{:places=>@places,:users=>@u,:place_accesses=>@place_acceses}
  @partner_bred=[]
  @partner_bred[0]=['Настройки','/partner/options']
  @partner_bred[1]=['Добавить пользователя','/partner/options/addUser']


end

def setAlerts
  #Уведомления
  @places_id=partner_admin_places_id
  if current_user.partner
    @partner=current_user.partner
  else
    @partner=current_user.place_accesses.first.place.partner
  end
  if @partner
      if params[:by_email]
        #if params[:by_email_text]
          @partner.by_email=params[:by_email]
        #end
      else
        @partner.by_email=nil
      end

      if params[:by_sms]
        if params[:by_sms_text]
          @partner.by_sms= '+7 ' + params[:by_sms_text]
        else
          if params[:by_sms].size > 2
            if params[:by_sms][0]=='+'
              @partner.by_sms = params[:by_sms]
            else
              @partner.by_sms = '+7 ' + params[:by_sms]
            end
          end
        end
      else
        @partner.by_sms=nil
      end

      if params[:by_phone]
        if params[:by_phone_text]
          @partner.by_phone= '+7 ' + params[:by_phone_text]
        else
          if params[:by_phone].size > 2
            if params[:by_phone][0]=='+'
              @partner.by_phone = params[:by_phone]
            else
              @partner.by_phone = '+7 ' + params[:by_phone]
            end
          end
        end
      else
        @partner.by_phone=nil
      end
      @partner.save
      redirect_to '/partner/options'
   #render :json => params
 else
   render :text=>'Partner not found'
 end
end


private
  def partner_admin_history
    render 'history',:layout=>'nil'
  end


def partner_admin
  if current_user
     if PlaceAccess.exists?(:user_id=>current_user.id,:access=>'2') or Partner.exists?(:user_id=>current_user.id)

     else
       flash[:notice]='Недостаточно прав'
       redirect_to '/partner'
     end
  else
     redirect_to '/'
  end
end

  def partner_admin_flag
    flag=true
    if current_user
      if PlaceAccess.exists?(:user_id=>current_user.id,:access=>'2') or Partner.exists?(:user_id=>current_user.id)

        else
        flash[:notice]='Недостаточно прав'
        flag=false
      end
    else
      flag=false
    end
    flag
  end

end

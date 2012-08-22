# encoding: utf-8
class Desc::PartnersController < ApplicationController

  before_filter :global_admins, :breadcrumbs
  layout 'desc'

  def breadcrumbs
    @bread = [['Главная', '/desc'], ['Партнеры', desc_partners_path]]
  end

  def index
    if params[:f] && params[:d]
      @partners = Partner.order(params[:f] + " " + params[:d])
    else
      @partners = Partner.all
    end
  end

  def show
    @partner = Partner.find(params[:id])
    @bread << [@partner.name]
  end

  def new
    @bread << ['Новый партнер']
    @partner = Partner.new
  end

  def edit
    @partner = Partner.find(params[:id])
    @bread << [@partner.name]
  end

  def create

    #Создаем нового юзера
    if params[:radio1]=='2'
      params[:user][:phone] = '+7 ' +  params[:user][:phone]
      if User.exists?(:phone=>params[:user][:phone])
        flash[:notice] = 'Такой телефон уже зарегестрирован в базе'
        redirect_to(new_desc_partner_url, notice: 'User phone is exist.') and return
        #render action: "new"
        #redirect_to '/desc/partners/new'
      else
        user=User.new({
                          :phone =>params[:user][:phone],
                          :first_name =>params[:user][:first_name],
                          :email =>params[:user][:email]
                      })

        user.password=params[:user][:password]
        user.save

        params[:partner][:user_id]=user.id
      end
    end

    if params[:radio1] == '0'
      params[:partner][:user_id] = 0
    end

    if params[:partner_by_phone_check]=="1" && params[:partner_by_phone]!=""
      params[:partner][:by_phone] = "+7 " + params[:partner_by_phone].to_s
    else
      params[:partner][:by_phone] = ""
    end
    if params[:partner_by_email_check]=="1" && params[:partner_by_email]!=""
      params[:partner][:by_email] = params[:partner_by_email].to_s
    else
      params[:partner][:by_email] = ""
    end
    if params[:partner_by_sms_check]=="1" && params[:partner_by_sms]!=""
      params[:partner][:by_sms] = "+7 " + params[:partner_by_sms].to_s
    else
      params[:partner][:by_sms] = ""
    end
    if params[:report_by_phone_check]=="1" && params[:report_by_phone]!=""
      params[:partner][:report_by_phone] = "+7 " + params[:report_by_phone].to_s
    else
      params[:partner][:report_by_phone] = ""
    end
    if params[:report_by_email_check]=="1" && params[:report_by_email]!=""
      params[:partner][:report_by_email] = params[:report_by_email].to_s
    else
      params[:partner][:report_by_email] = ""
    end
    if params[:report_by_sms_check]=="1" && params[:report_by_sms]!=""
      params[:partner][:report_by_sms] = "+7 " + params[:report_by_sms].to_s
    else
      params[:partner][:report_by_sms] = ""
    end

    @partner = Partner.new(params[:partner])
    if params[:partner][:user_id].to_i > 0
      User.find(params[:partner][:user_id]).update_attribute(:access, 2)
    end
    if @partner.save
      redirect_to desc_partners_url, notice: 'Partner was successfully created.'
     # render :json=>{:params=>params}
    else
     render action: "new"
     # render :json=>{:params=>params}
    end
  end

  def update
    @partner = Partner.find(params[:id])
    olduid = @partner.user_id
    if params[:radio1]=='2'
      params[:user][:phone] = '+7 ' +  params[:user][:phone]
      if User.exists?(:phone=>params[:user][:phone])
        flash[:notice] = 'Такой телефон уже зарегестрирован в базе'
        redirect_to(edit_desc_partner_url(params[:id]), notice: 'User phone is exist.') and return
        #redirect_to '/desc/partners'
      else
        user=User.new({
                          :phone =>params[:user][:phone],
                          :first_name =>params[:user][:first_name],
                          :email =>params[:user][:email]
                      })

        user.password=params[:user][:password]

        if user.access.to_i <= 2 then
          user.access = 2
        end
        user.save

        params[:partner][:user_id]=user.id
        @partner.user_id = user.id
        @partner.save
        if olduid.to_i > 0
          setUserAccess olduid
        end
      end
    end

    if params[:radio1] == '0'
      @partner.update_attribute(:user_id, 0)
      if olduid.to_i > 0
        setUserAccess olduid
      end
    end

    if @partner.user_id.to_i > 0 && @partner.user_id.to_i != params[:partner][:user_id].to_i
      @partner.user_id = 0
      @partner.save
      if olduid.to_i > 0
        User.find(olduid).update_attribute(:access, 0)
        setUserAccess olduid
      end
      User.find(params[:partner][:user_id]).update_attribute(:access, 2)
    end

    if params[:partner_by_phone_check]=="1" && params[:partner_by_phone]!=""
      params[:partner][:by_phone] = "+7 " + params[:partner_by_phone].to_s
    else
      params[:partner][:by_phone] = ""
    end
    if params[:partner_by_email_check]=="1" && params[:partner_by_email]!=""
      params[:partner][:by_email] = params[:partner_by_email].to_s
    else
      params[:partner][:by_email] = ""
    end
    if params[:partner_by_sms_check]=="1" && params[:partner_by_sms]!=""
      params[:partner][:by_sms] = "+7 " + params[:partner_by_sms].to_s
    else
      params[:partner][:by_sms] = ""
    end
    if params[:report_by_phone_check]=="1" && params[:report_by_phone]!=""
      params[:partner][:report_by_phone] = "+7 " + params[:report_by_phone].to_s
    else
      params[:partner][:report_by_phone] = ""
    end
    if params[:report_by_email_check]=="1" && params[:report_by_email]!=""
      params[:partner][:report_by_email] = params[:report_by_email].to_s
    else
      params[:partner][:report_by_email] = ""
    end
    if params[:report_by_sms_check]=="1" && params[:report_by_sms]!=""
      params[:partner][:report_by_sms] = "+7 " + params[:report_by_sms].to_s
    else
      params[:partner][:report_by_sms] = ""
    end
    if @partner.update_attributes(params[:partner])
      redirect_to desc_partners_url, notice: 'Partner was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @partner = Partner.find(params[:id])

    users=[]

    @partner.places.each do |pl|
      pl.place_accesses.map{|p| users << p.user_id}
    end
    @partner.destroy

    users.uniq.each do |u|
      setUserAccess u
    end
    redirect_to desc_partners_url
  end

end

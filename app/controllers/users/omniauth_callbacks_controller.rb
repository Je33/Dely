class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  #encoding: UTF-8
  def facebook
    @user = User.find_for_facebook_oauth(request.env["omniauth.auth"], current_user)
    if @user.persisted?
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Facebook"
      #Теперь надо вывести окно ввода телефона
      sign_in @user
      #redirect_to '/profile'
      sign_in_and_redirect @user, :event => :authentication
    else
      flash[:notice] = 'FAIL'
      session["devise.facebook_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end

  def passthru
    render :file => "#{Rails.root}/public/404_.html", :status => 404, :layout => false
  end

  def vkontakte
    #@info = request.env["omniauth.auth"]
    #user = User.find_for_vkontakte_oauth request.env["omniauth.auth"]
    #if <hh user=user>.persisted?
    user = User.find_for_vkontakte_oauth request.env["omniauth.auth"]
    if user.persisted?
    flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Vkontakte"
    sign_in_and_redirect user, :event => :authentication
    else
      flash[:notice] = "authentication error"
      redirect_to root_path
    end
  end

end





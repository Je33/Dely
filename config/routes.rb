Delivery::Application.routes.draw do

  get "/desc" => "desc/orders#index"

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  root :to => 'index#index'

  match '/404' => 'index#not_found'
  match '/success/:id' => 'index#success'
  match '/place/:id' => 'index#place'
  match "/ajax/:action" => 'ajax'
  match '/forms/:action' => 'forms'
  match '/license' => 'index#license'
  match '/partnership' => 'index#partnership'
  match '/vacancy' => 'index#vacancy'
  match '/contact' => 'index#contact'
  match '/welcome' => 'index#welcome'
  match '/gifts' => 'index#gifts'

  match '/profile/:action' => 'profile'
  match '/profile' => 'profile#info'
  match '/profile/gifts' => 'index#userGifts'

  match '/partner' => 'partner/orders#index'
  match '/partner/orders/:order_id/ajaxEdit' => 'partner/orders#ajaxEdit'
  match '/partner/orders/:order_id/ajax_roll_back' => 'partner/orders#ajax_roll_back'
  match '/partner/orders/sortIndex' => 'partner/orders#sortIndex'
  match '/partner/orders/ajaxPaginate' => 'partner/orders#ajaxPaginate'
  match '/partner/orders/:order_id/ajaxRecover' => 'partner/orders#ajaxRecover'
  match '/partner/orders/:order_id/ajaxAdopted' => 'partner/orders#ajaxAdopted'
  match '/desc/orders/:order_id/ajaxEdit' => 'desc/orders#ajaxEdit'
  match '/desc/orders/sortIndex' => 'desc/orders#sortIndex'
  match '/desc/orders/ajaxPaginate' => 'desc/orders#ajaxPaginate'
  match '/desc/orders/ajaxIndex'=>'desc/orders#ajaxIndex'
  match '/desc/orders/:order_id/ajaxChangeAddress'=>'desc/orders#ajaxChangeAddress'

  match '/desc/orders/:order_id/ajax_roll_back'=>'desc/orders#ajax_roll_back'
  match '/desc/orders/:order_id/ajaxRecover' => 'desc/orders#ajaxRecover'
  match '/desc/orders/:order_id/ajaxAdopted' => 'desc/orders#ajaxAdopted'
  namespace :partner do
    root :to => 'orders#index'
    match "/ajax/:action" => 'ajax'
    get 'options' => 'places#options'
    get 'options/ajaxOptions' => 'places#ajaxOptions'
    match 'options/addUser' => 'places#addUser'
    post 'options/ajaxUserSave/' => 'places#ajaxUserSave'
    get 'options/ajaxOptionsUsers' => 'places#ajaxOptionsUsers'
    get 'options/ajaxUserEdit' => 'places#ajaxUserEdit'
    match 'options/delete_user' => 'places#delete_user'
    match 'options/setAlerts' => 'places#setAlerts'
    get 'options/accordion' => 'places#accordion'
    #match 'options/ajaxhistory' => 'places#ajaxhistory'
    match 'finances/ajaxPrice'=>'finances#ajaxPrice'
    match 'finances/ajaxIndex'=>'finances#ajaxIndex'
    match 'finances/ajaxBreadcrumb'=>'finances#ajaxBreadcrumb'
    #match 'finances/:id/render_to_xls' =>'finances#render_to_xls'

    #match "/ajax/:action" => 'ajax'
    match "/statistics/:action" => 'statistics'
    match "/statistics" => 'statistics#index'

    resources :finances
    resources :orders do
      get 'ajaxAdd'
      match 'ajaxSubmit'
      match 'ajaxTransfer'
      match 'ajaxCancel'
      match 'ajaxDeliver'
    end
    resources :places do
      #end
      match 'specials/showPic' => 'specials#showPic'
      resources :specials
      resources :sections do
        resources :items
      end
    end
  end

=begin
  namespace :operator do
    resources :orders do
      get 'ajaxAdd'
      match 'submit'
      match 'transmit'
      match 'cancel_order'
      match 'cancel_submit'
    end
    resources :places do
    end
  end
=end

  namespace :desc do
    root :to => "desc#orders"
    match "/ajax/:action" => 'ajax'
    match "/statistics/:action" => 'statistics'
    #match "/statistics/:action/:tab" => 'statistics'
    match "/statistics" => 'statistics#index'
    resources :users
    resources :cities do
      resources :regions
      resources :metros
    end
    resources :orders do
      #match '' orders_region_id_select
      match 'ajaxAdd'
      match 'ajaxSubmit'
      match 'ajaxTransfer'
      match 'ajaxCancel'
      match 'ajaxDeliver'
    end
    match 'finances/ajaxPrice'=>'finances#ajaxPrice'
    match 'finances/ajaxIndex'=>'finances#ajaxIndex'
    match 'finances/ajaxBreadcrumb'=>'finances#ajaxBreadcrumb'
    match 'finances/:id/render_to_xls' =>'finances#render_to_xls'
    match 'finances/:id/send_report' =>'finances#send_report'
    match 'finances/:id/send_called_report' =>'finances#send_called_report'
    resources :finances
    resources :kitchens
    resources :specials
    resources :populars
    resources :partners do
      resources :places do
        resources :sections do
          resources :items
        end
      end
    end
    resources :gift_sections do
      resources :gifts
    end
    resources :usergifts
  end
  match "*path", :to => "application#not_found"
end

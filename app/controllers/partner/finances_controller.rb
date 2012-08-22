#encoding: utf-8
class Partner::FinancesController < ApplicationController
  before_filter :authenticate_user!
  before_filter :partners_only, :breds, :title_set
  layout 'partner'
  respond_to :xls, :html

  def title_set
    @title = "Svek.la {свекла}"
    @descr = "Svek.la {свекла} это новый удобный способ заказывать любимую еду и получать за это подарки."
    @title = "Личный кабинет | " + @title
  end

def index

  #finance = Finance.cron_finance

  @title = "Финансы | " + @title
  breds
  @finances = []
  if !params[:period] then
   @period=(Time.now - 1.month).strftime("%Y-%m-01")
  else
    @period=params[:period]
  end
     #если передали параметр времени
    @partner_bred=[]
    @partner_bred[0]=['Финансы', partner_finances_path]
    if params[:place_id]
      @partner_bred[1]=[Place.find(params[:place_id]).name,partner_finances_path(:place_id=>params[:place_id])]
      #@finances=Finance.where('finance_status_id IN (30,50) AND place_id = ? and period = ?',params[:place_id],@period)

      Finance.where('place_id = ? and period = ?',params[:place_id],@period).each do |f|
          finance_orders_price(f.id)
          @finances << f
      end
      @finances = Finance.where('place_id = ? and period = ?',params[:place_id],@period)

    else
      #@finances=Finance.where('finance_status_id IN (30,50) and period = ? and place_id IN (?)',@period, partner_admin_places_id)#.map{|f| @finances<<f}
      Finance.where('period = ? and place_id IN (?)',@period, partner_admin_places_id).each do |f|
        finance_orders_price(f.id)
      end
      @finances = Finance.where('period = ? and place_id IN (?)',@period, partner_admin_places_id)
    end

 # @finance_statuses=[]
 # @finance_statuses<<[(I18n.t 'All statuses'),0]
 # @finance_statuses<<[(I18n.t 'send'),30]
 # @finance_statuses<<[(I18n.t 'pay-in'),50]

  @finance_statuses=[]
  @finance_statuses<<[(I18n.t 'All statuses'),0]
  FinanceStatus.all.map{|i| @finance_statuses<<[(I18n.t i.name),i.id]}
  @finance_statuses[1][0]=I18n.t 'new'

  @places=[]
  @places<<[(I18n.t 'All places'),0]
  Place.where(:id=>partner_admin_places_id).map{|d| @places<<[d.name,d.id]}
  if current_user.place_accesses
     if Place.exists?(current_user.place_accesses.first.place_id)
        @partner = Place.find(current_user.place_accesses.first.place_id).partner
     end
  end
  #Finance.select(:place_id).uniq.map{|d| @places<<[(Place.find(d.place_id).name),(d.place_id)]}
end



  def ajaxIndex
    if !params[:period] then
      @period=Time.now.strftime("%Y-%m-01")
    else
      @period=params[:period]
    end
    #@finances=Finance.where('finance_status_id IN (30,50)  and period = ? and place_id IN (?)',@period, partner_admin_places_id)
    @finances=Finance.where('period = ? and place_id IN (?)',@period, partner_admin_places_id)

    if params[:place_id].to_i==0
      if params[:status_id].to_i==0
      else
        @finances=@finances.where(:finance_status_id=>params[:status_id])
      end
    else
      if params[:status_id].to_i==0
        @finances=@finances.where(:place_id=>params[:place_id])
      else
        @finances=@finances.where(:place_id=>params[:place_id], :finance_status_id=>params[:status_id])
      end
    end

    render '_ajaxIndex',:layout=>'nil'
  end

def ajaxPrice
  if params[:month] and params[:year] and params[:place_id]
    time = (params[:year]+'-'+ params[:month]+'-'+'01').to_date

    #order=Place.find(params[:place_id]).orders.where('created_at >= ? AND created_at <= ? AND (status_id>=60 or status_id=20)',time.beginning_of_month,time.end_of_month)
    order=Place.find(params[:place_id]).orders.where('created_at >= ? AND created_at <= ? AND (status_id = 100)',time.beginning_of_month,time.end_of_month)
    #Time.now.beginning_of_month, Time.now.end_of_month
    price=0
    order.map{|o| price+=o.price}
    render :json=>{:cnt=>order.count,:price=>price}
  end

end


def create
  redirect_to partner_finances_path
end

def show
  @title = "Счет # #{params[:id]} | " + @title
  breds
  @finance = Finance.find(params[:id])
  #if   @finance.finance_status_id!=30 and  @finance.finance_status_id!=50
  #  redirect_to partner_finances_path
  #else
    @partner_bred=[]
    @partner_bred[0]=['Финансы',partner_finances_path]
    @partner_bred[1]=[@finance.place.name,partner_finances_path(:place_id=>@finance.place.id)]
    @partner_bred[2]=[(I18n.t @finance.period.strftime("%B"))+@finance.period.strftime(" %Y"),'#']
    #@orders=Place.find(@finance.place_id).orders.where('created_at >= ? AND created_at <= ? AND (status_id>=60 or status_id=20)',@finance.period.beginning_of_month,@finance.period.end_of_month)
    @orders=Place.find(@finance.place_id).orders.where('created_at >= ? AND created_at <= ? AND (status_id = 100)',@finance.period.beginning_of_month,@finance.period.end_of_month)
  #end
end

def ajaxBreadcrumb
  @partner_bred=[]
  @partner_bred[0]=['Финансы',partner_finances_path]
  if params[:place_id].to_i!=0
    @partner_bred[1]=[' / '+Place.find(params[:place_id]).name,partner_finances_path(:place_id=>params[:place_id])]
  end
  @period=Time.now.strftime("%Y-%m-01")
  render '_breadcrumb',:layout=>'nil'
end

def edit
  redirect_to partner_finances_path
end

def update
  redirect_to partner_finances_path
end

def destroy
  redirect_to partner_finances_path
end



end

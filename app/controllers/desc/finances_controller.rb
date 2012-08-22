#encoding: utf-8
class Desc::FinancesController < ApplicationController
  #encoding: utf-8
    #before_filter :authenticate_user!
    #before_filter :partners_only
  before_filter :global_admins
  layout 'desc'



    def index
      #@breads

      if !params[:period] then
        @period=Time.now.strftime("%Y-%m-01")
      else
        @period=params[:period]
      end
      #если передали параметр времени
      @bread=[]
      @bread[0]=['Финансы',desc_finances_path]
      @finances=[]
      if params[:place_id]
        @bread[1]=[Place.find(params[:place_id]).name,desc_finances_path(:place_id=>params[:place_id])]

        Finance.where('place_id = ? and period = ?',params[:place_id],@period).each do |f|
          finance_orders_price(f.id)
        end

        Finance.where('finance_status_id = 40 AND place_id=? and period = ?',params[:place_id],@period).map{|f| @finances<<f}
        Finance.where('finance_status_id <= 10 AND place_id=? and period = ?',params[:place_id],@period).map{|f| @finances<<f}
        Finance.where('finance_status_id > 10 and finance_status_id < 40 AND place_id=? and period = ?',params[:place_id],@period).map{|f| @finances<<f}#.order('finance_status_id desc')
        Finance.where('finance_status_id > 40 AND place_id=? and period = ?',params[:place_id],@period).map{|f| @finances<<f}
      else

        Finance.where('period = ?',@period).each do |f|
          finance_orders_price(f.id)
        end

        Finance.where('finance_status_id = 40 and period = ?',@period).map{|f| @finances<<f}
        Finance.where('finance_status_id <= 10 and period = ?',@period).map{|f| @finances<<f}
        Finance.where('finance_status_id > 10 and finance_status_id < 40 and period = ?',@period).map{|f| @finances<<f}#.order('finance_status_id desc')
        Finance.where('finance_status_id > 40 and period = ?',@period).map{|f| @finances<<f}
      end

      @finance_statuses=[]
      @finance_statuses<<[(I18n.t 'All statuses'),0]
      FinanceStatus.all.map{|i| @finance_statuses<<[(I18n.t i.name),i.id]}
      @dates=[]
      @dates<<['Все время',0]
      time=Time.now
      while Time.now-2.years < time  do
        @dates<<[((I18n.t time.strftime("%B"))+time.strftime(" %Y")),time.strftime("%Y-%m-01")]
        time=time-1.month
      end
      @places=[]
      @places<<[(I18n.t 'All places'),0]
      Finance.select(:place_id).uniq.map{|d| @places<<[(Place.find(d.place_id).name),(d.place_id)]}
      #render :json=>{:period=>@period,:fin=>@finances}
    end



    def ajaxIndex
      if params[:place_id].to_i==0
        if params[:status_id].to_i==0
          @finances=Finance.where('id > 1')
        else
          @finances=Finance.where(:finance_status_id=>params[:status_id])
        end
      else
        if params[:status_id].to_i==0
          @finances=Finance.where(:place_id=>params[:place_id])
        else
          @finances=Finance.where(:place_id=>params[:place_id], :finance_status_id=>params[:status_id])
        end
      end
      if params[:period].to_s!=''
        @finances =  @finances.where(:period=>params[:period])
      end
      render '_ajaxIndex',:layout=>'nil'
    end


    def new
      @bread=[]
      @bread[0]=['Финансы',desc_finances_path]
      @finance=Finance.new
      @places=Place.all.map{|p| [p.name,p.id]}

    end

    def ajaxPrice
      if params[:month] and params[:year] and params[:place_id]
        time = (params[:year]+'-'+ params[:month]+'-'+'01').to_date

       # order=Place.find(params[:place_id]).orders.where('created_at >= ? AND created_at <= ? AND (status_id>=60 or status_id=20)',time.beginning_of_month,time.end_of_month)
        order=Place.find(params[:place_id]).orders.where('created_at >= ? AND created_at <= ? AND status_id = 100',time.beginning_of_month,time.end_of_month)

        #Time.now.beginning_of_month, Time.now.end_of_month
        price=0
        order.map{|o| price+=o.price}
        render :json=>{:cnt=>order.count,:price=>price}
      end

    end


    def create
      @finance = Finance.new(params[:finance])
      if @finance.save
        #Section.find(params[:section_id]).update_attributes(:cnt => Section.find(params[:section_id]).cnt.to_i+1)
        flash[:notice] = 'finance was successfully created.'
        redirect_to desc_finances_path
      else
        flash[:notice] = 'finance was not successfully created.'
        redirect_to desc_finances_path
      end
    end

    def show
      @breads
      @finance = Finance.find(params[:id])
      @bread=[]
      @bread[0]=['Финансы',desc_finances_path]
      @bread[1]=[@finance.place.name,desc_finances_path(:place_id=>@finance.place.id)]
      @bread[2]=[(I18n.t @finance.period.strftime("%B"))+@finance.period.strftime(" %Y"),'#']
     # @orders=Place.find(@finance.place_id).orders.where('created_at >= ? AND created_at <= ? AND (status_id>=60 or status_id=20)',@finance.period.beginning_of_month,@finance.period.end_of_month)
      @orders=Place.find(@finance.place_id).orders.where('created_at >= ? AND created_at <= ? AND (status_id = 100)',@finance.period.beginning_of_month,@finance.period.end_of_month)
    end

    def edit_old
      @breads
      @finance = Finance.find(params[:id])
      @orders=Place.find(@finance.place_id).orders.where('created_at >= ? AND created_at <= ? AND (status_id = 100)',@finance.period.beginning_of_month,@finance.period.end_of_month)

    end
    def send_called_report
      finance = Finance.find(params[:id])

      if finance.place.partner.report_by_sms.to_s!=''
        mes="У вас новый отчёт по заказам для ресторана "+ finance.place.name + ". Перейдите в свой личный кабинет для согласовния. Спасибо!"
        LittleSMS.new(SMS_USER, SMS_KEY) do
          msg = message.send(:recipients =>finance.place.partner.report_by_sms, :message => mes, :sender => SMS_SENDER)
        end
      end

      if finance.place.partner.report_by_email.to_s!=''
        render_to_xls
      end
      finance.finance_status_id = 30
      finance.save

      render :text=>'sended'
    end

    def send_report
      finance = Finance.find(params[:id])
        #Отправляем уведомления
      if finance.place.partner.report_by_phone.to_s!=''
        #По телефону
        render :json=>{:phone=>finance.place.partner.report_by_phone.to_s}
      else
        render :json=>{:phone=>0}
      end

    end


    def update
      @finance = Finance.find(params[:id])
      @finance.update_attributes(params[:finance])
      if params[:finance][:finance_status_id].to_i==30
        #Отправляем уведомления
        if @finance.place.partner.report_by_sms.to_s!=''
          sms=@finance.place.partner.report_by_sms.to_s
          mes="У вас новый отчёт по заказам для ресторана "+ @finance.place.name + ". Перейдите в свой личный кабинет для согласовния. Спасибо!"
          LittleSMS.new(SMS_USER, SMS_KEY) do
            msg = message.send(:recipients =>sms, :message => mes)
          end
        end

        if @finance.place.partner.report_by_email.to_s!=''
          render_to_xls
        end

      end
      if @finance.save
        flash[:finance] =  'saved'
        if params[:key]
          redirect_to desc_finance_path(params[:id]),:method=>'GET'
        else
          redirect_to  desc_finances_path
        end
      else
        flash[:finance] =  'not saved'
        redirect_to  desc_finances_path
      end
    end

    def destroy
      if Finance.delete_all(:id=>params[:id])
        flash[:notice] = 'Finance was successfully deleted.'
      end
      redirect_to  desc_finances_path
    end




  def  render_to_xls
    finance=Finance.find(params[:id])
    orders=finance.place.orders.select("id,created_at,place_id,street,house,room,price,status_id,rating").where('created_at >= ? AND created_at <= ? AND (status_id = 100)',finance.period.beginning_of_month,finance.period.end_of_month)
    book = Spreadsheet::Workbook.new
    sheet1 = book.create_worksheet :name => 'отчет'

    sheet1[0,0] = 'Отчёт'
    sheet1[0,1] = finance.id
    format = Spreadsheet::Format.new :weight => :bold,
                                     :size => 18
    sheet1.row(0).default_format = format
    sheet1.row(1).push 'Период',finance.period.beginning_of_month.strftime("%d.%m.%Y").to_s+"-"+finance.period.end_of_month.strftime("%d.%m.%Y").to_s
    format = Spreadsheet::Format.new :weight => :bold,
                                     :size => 14
    sheet1.row(1).default_format = format

    sheet1.row(2).push ''
    sheet1.row(3).push 'Дата создания отчёта',(finance.period.to_date).strftime("%d.%m.%Y").to_s
    sheet1.row(4).push 'Номер договора/id партнёра', finance.place.partner.id
    sheet1.row(5).push 'Наименование ресторана', finance.place.name
    sheet1.row(6).push 'Адрес', finance.place.partner.address
    sheet1.row(7).push  ''
    sheet1.row(8).push ''
    sheet1.row(9).push '#','дата',	'время',	'ресторан',	'адрес доставки',	'сумма (руб.)',	'статус',	'оценка'
    format = Spreadsheet::Format.new :weight => :bold,
                                     :size => 10,
                                     :pattern_fg_color => :grey, :pattern => 1
    sheet1.row(9).default_format = format

    i=10
    sum = 0
    orders.each do |o|
      sum = sum + o.price
      sheet1.row(i).push o.id, o.created_at.localtime().strftime("%d.%m.%Y").to_s, o.created_at.localtime().strftime("%H:%M:%S").to_s ,o.place.name,
                         ((o.street.to_s!='' ? 'ул.'+o.street : '')+(o.house.to_s!='' ? ' д.'+o.house : '')+ (o.room.to_s!='' ? ' кв.'+o.room : '')),o.price.ceil.to_s+' руб.', o.status.name,o.rating
      i=i+1
    end
    sheet1.row(i).push'Сумма заказов',sum.ceil.to_s+' руб.'
    sheet1.row(i+1).push 'Итого к оплате',(finance.place.partner.pct.to_s!='' ? ((sum/100)*finance.place.partner.pct).ceil.to_s + ' руб.' : 'Не указан процент!')

    format = Spreadsheet::Format.new :weight => :bold,
                                     :size => 10
    sheet1.row(i).default_format = format
    format = Spreadsheet::Format.new :weight => :bold,
                                     :size => 18
    sheet1.row(i+1).default_format = format
    sheet1.column(0).width = 28
    sheet1.column(1).width = 20
    sheet1.column(4).width = 30
    sheet1.column(6).width = 20

    date=(I18n.t ((finance.period.to_date).strftime("%B")))+','+ finance.period.to_date.strftime("%Y")

    dir='public/reports/' + finance.place.id.to_s + '/' + finance.period.to_s
    if File.exists?('public/reports')
      if File.exists?('public/reports/' + finance.place.id.to_s)
        if File.exists?(dir)
        else
          Dir.mkdir(dir)
        end

      else
        Dir.mkdir('public/reports/' + finance.place.id.to_s)
        Dir.mkdir(dir)
      end
    else
      Dir.mkdir('public/reports')
      Dir.mkdir('public/reports/' + finance.place.id.to_s)
      Dir.mkdir(dir)
    end
    book.write (dir +'/'+ date + '.xls')
    #mess="На портале svek.la появился новый отчет для вас по ресторану " + finance.place.name
    mess="Svek.la | отчёт за "+ date +" | " + finance.place.name

    FinanceNotify.new_report(dir +'/'+ date + '.xls',finance.place.partner.report_by_email,date + '.xls',mess).deliver
    #render :json=>{:place=>finance.place,:finance=>finance}
    #send_file (dir + '/'+ finance.period.to_s + '.xls'), :type => 'application/excel; charset=utf-8;'
  end


end

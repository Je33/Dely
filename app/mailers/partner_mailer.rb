# encoding: utf-8
class PartnerMailer < ActionMailer::Base
  default :from => "notify@svek.la"

  def new_order(order, email)
    @order = order
    if email
      mail(:to => email, :subject => "Новый заказ на svek.la")
    end
  end

end

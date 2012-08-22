# encoding: utf-8
class FinanceNotify < ActionMailer::Base
  default :from => "notify@svek.la"

  def new_report(file_path, email,filename,mess)
    #@order = order
    attachments[filename] = File.read(file_path)
    if email
      mail(:to => email, :subject => mess)
    end

  end
end

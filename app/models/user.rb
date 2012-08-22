# encoding: utf-8
class User < ActiveRecord::Base
  scope :activated, where(:active => 1)
  belongs_to :city
  belongs_to :place
  has_many :place_accesses
  has_many :addresses
  has_many :logs
  has_one :partner
  has_many :orders
  has_many :usergifts
  #has_many :partner
  has_many :logs, :dependent => :delete_all
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, :token_authenticatable, :authentication_keys => [:phone]

  attr_accessible :active, :phone, :email, :access, :first_name, :password, :password_confirmation, :remember_me, :uid, :last_name, :active
  validates :phone, :presence => true, :uniqueness => true, :format => /^\+7\s\(\d{3}\)\s\d{3}\-\d{4}$/i

  def self.find_for_facebook_oauth(access_token, signed_in_resource=nil)
    #Проверяем на UID
    if User.exists?(:uid => access_token.uid.to_s)
      User.find_by_uid(access_token.uid.to_s)
    else
      #Нет такого,тогда авторизируемся через FB
      data = access_token.extra.raw_info
      if data.phone.to_s!='' then
        #Телефон указан
        phone = data.phone.to_s
      else
        #Форма ввода телефона
        phone = '+7 (911) 111-1111'
      end
      if User.exists?(:phone => phone)
        User.find_by_phone(phone)
      else # Create a user with a stub password.
        User.create!(:email => data.email, :password => Devise.friendly_token[0,20],:uid=>access_token.uid,:first_name=>data.first_name,:last_name=>data.last_name,:phone => phone)
      end
    end
  end

  def self.find_for_vkontakte_oauth access_token
    data = access_token.extra.raw_info
    if User.exists?(:uid => access_token.uid.to_s)
      User.find_by_uid(access_token.uid.to_s)
    else
      if data.phone.to_s!='' then
        #Телефон указан
        phone = data.phone.to_s
      else
        #Форма ввода телефона
        phone = '+7 (911) 111-1111'
      end
      if User.exists?(:phone => phone)
        User.find_by_phone(phone)
      else # Create a user with a stub password.
        User.create!(:password => Devise.friendly_token[0,20],:uid=>access_token.uid,:first_name=>data.first_name,:last_name=>data.last_name,:phone => phone)
      end
    end
  end


  def email_required?
    false
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.facebook_data"] && session["devise.facebook_data"]["extra"]["raw_info"]
        user.email = auth["email"]
      end
    end
  end

  def user_path
    '/profile'
  end

  def get_access_name
    case self.access
      when 0
        "Пользователь"
      when 1
        "Оператор партнера"
      when 2
        "Администратор партнера"
      when 3
        "Оператор системы"
      when 4
        "Администратор системы"
    end
  end


  #validates_format_of :email, :with => /^[-a-z0-9_+\.]+\@([-a-z0-9]+\.)+[a-z0-9]{2,4}$/i
end

# encoding: utf-8
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
#   Place.create([
#      { active: 1, name: 'Mister gamburger', description: 'Gamburger, Cheesburger etc..', min_order: 200, delivery_price: 0, delivery_time: '30', rating_plus: 53, rating_minus: 68 },
#      { active: 1, name: 'Mac king', description: 'Gamburger 15 rub.!', min_order: 150, delivery_price: 0, delivery_time: '40', rating_plus: 34, rating_minus: 20 }
#   ])
FinanceStatus.exists?(:name=>'not-ordered') ? '' : FinanceStatus.create!(:name => 'not-ordered', :id => 10)
FinanceStatus.exists?(:name=>'ordered') ? '' : FinanceStatus.create!(:name => 'ordered', :id => 20)
FinanceStatus.exists?(:name=>'send') ? '' : FinanceStatus.create!(:name => 'send', :id => 30)
FinanceStatus.exists?(:name=>'need-call') ? '' : FinanceStatus.create!(:name => 'need-call', :id => 40)
FinanceStatus.exists?(:name=>'pay-in') ? '' : FinanceStatus.create!(:name => 'pay-in', :id => 50)


Status.exists?(:id=>10) ? '' : Status.create!(:name=>'новый',:id=>10)
Status.exists?(:name=>'отменён пользователем') ? '' : Status.create!(:name=>'отменён пользователем',:id=>20)
Status.exists?(:name=>'принят оператором') ? '' : Status.create!(:name=>'принят оператором',:id=>30)
Status.exists?(:name=>'не принят') ? '' : Status.create!(:name=>'не принят',:id=>40)
Status.exists?(:name=>'отменён оператором') ? '' : Status.create!(:name=>'отменён оператором',:id=>50)
Status.exists?(:name=>'подтверждён') ? '' : Status.create!(:name=>'подтверждён',:id=>55)
Status.exists?(:id => 60) ? '' : Status.create!(:name=>'отправлен в ресторан',:id=>60)
Status.exists?(:id => 61) ? '' : Status.create!(:name=>'отправлен в ресторан',:id=>61)
Status.exists?(:id => 62) ? '' : Status.create!(:name=>'отправлен в ресторан',:id=>62)
Status.exists?(:id => 70) ? '' : Status.create!(:name=>'новый для ресторана',:id=>70)
Status.exists?(:name=>'принят рестораном') ? '' : Status.create!(:name=>'принят рестораном',:id=>80)
Status.exists?(:name=>'отменён рестораном') ? '' : Status.create!(:name=>'отменён рестораном',:id=>90)
Status.exists?(:name=>'доставлен (необходима проверка)') ? '' : Status.create!(:name=>'доставлен (необходима проверка)',:id=>95)
Status.exists?(:name=>'доставлен') ? '' : Status.create!(:name=>'доставлен',:id=>100)

GiftStatus.exists?(:name=>'заказан') ? '' : GiftStatus.create!(:name => 'заказан', :id => 10)
GiftStatus.exists?(:name=>'подтверждён') ? '' : GiftStatus.create!(:name => 'подтверждён', :id => 20)
GiftStatus.exists?(:name=>'доставлен') ? '' : GiftStatus.create!(:name => 'доставлен', :id => 30)

User.exists?(:phone => '+7 (000) 000-0000') ? '' : User.create!(:phone => '+7 (000) 000-0000', :password=>'000000', :access=>4)
require 'test_helper'

class Desc::SpecialsControllerTest < ActionController::TestCase
  setup do
    @desc_special = desc_specials(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:desc_specials)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create desc_special" do
    assert_difference('Desc::Special.count') do
      post :create, desc_special: @desc_special.attributes
    end

    assert_redirected_to desc_special_path(assigns(:desc_special))
  end

  test "should show desc_special" do
    get :show, id: @desc_special
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @desc_special
    assert_response :success
  end

  test "should update desc_special" do
    put :update, id: @desc_special, desc_special: @desc_special.attributes
    assert_redirected_to desc_special_path(assigns(:desc_special))
  end

  test "should destroy desc_special" do
    assert_difference('Desc::Special.count', -1) do
      delete :destroy, id: @desc_special
    end

    assert_redirected_to desc_specials_path
  end
end

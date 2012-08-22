require 'test_helper'

class Desc::PopularsControllerTest < ActionController::TestCase
  setup do
    @desc_popular = desc_populars(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:desc_populars)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create desc_popular" do
    assert_difference('Desc::Popular.count') do
      post :create, desc_popular: @desc_popular.attributes
    end

    assert_redirected_to desc_popular_path(assigns(:desc_popular))
  end

  test "should show desc_popular" do
    get :show, id: @desc_popular
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @desc_popular
    assert_response :success
  end

  test "should update desc_popular" do
    put :update, id: @desc_popular, desc_popular: @desc_popular.attributes
    assert_redirected_to desc_popular_path(assigns(:desc_popular))
  end

  test "should destroy desc_popular" do
    assert_difference('Desc::Popular.count', -1) do
      delete :destroy, id: @desc_popular
    end

    assert_redirected_to desc_populars_path
  end
end

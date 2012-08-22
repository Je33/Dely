require 'test_helper'

class Desc::PlacesControllerTest < ActionController::TestCase
  setup do
    @desc_place = desc_places(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:desc_places)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create desc_place" do
    assert_difference('Desc::Place.count') do
      post :create, desc_place: @desc_place.attributes
    end

    assert_redirected_to desc_place_path(assigns(:desc_place))
  end

  test "should show desc_place" do
    get :show, id: @desc_place
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @desc_place
    assert_response :success
  end

  test "should update desc_place" do
    put :update, id: @desc_place, desc_place: @desc_place.attributes
    assert_redirected_to desc_place_path(assigns(:desc_place))
  end

  test "should destroy desc_place" do
    assert_difference('Desc::Place.count', -1) do
      delete :destroy, id: @desc_place
    end

    assert_redirected_to desc_places_path
  end
end

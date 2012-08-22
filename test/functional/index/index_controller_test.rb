require 'test_helper'

class Index::IndexControllerTest < ActionController::TestCase
  test "should get canselorder" do
    get :canselorder
    assert_response :success
  end

end

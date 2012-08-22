require 'test_helper'

class IndexControllerTest < ActionController::TestCase
  test "should get success" do
    get :success
    assert_response :success
  end

end

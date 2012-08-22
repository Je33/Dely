module ApplicationHelper
  def months
    ['January','February','March','April','May','June','July','August','September','October','November','December']
  end
  def to_path(prms)
    "?" + prms.except(:controller, :action).to_param
  end
end

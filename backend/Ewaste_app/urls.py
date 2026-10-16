from django.urls import path
from .views.Auth import views_Auth
from .views.User import views_Sell
from .views.Admin import views_Reports, views_SellRequest, views_Employee, views_Designation, views_Role

urlpatterns = [
    # -------Auth---------
    path('Register/', views_Auth.Register),
    path('Login/', views_Auth.Login),
    # -------Auth---------

    # -------------User------------
    path('User/Sell/', views_Sell.Sell),
    # -------------User------------

    # ---------Admin sell request------------------
    path('Admin/SellRequests/', views_SellRequest.SellRequests),
    path('Admin/CollectorAutocomplete/',views_SellRequest.CollectorAutocomplete),
    # ---------Admin sell request------------------

    # -----------------Admin Employees------------------
    path('Admin/Employees/', views_Employee.Employees),
    path('Admin/EmployeeCreate/', views_Employee.EmployeeCreate),
    path('Admin/EmployeeUpdate/<int:id>/', views_Employee.EmployeeUpdate),
    # -----------------Admin Employees------------------

    # -----------------Admin Designations------------------
    path('Admin/Designations/', views_Designation.Designations),
    path('Admin/DesignationCreate/', views_Designation.DesignationCreate),
    path('Admin/DesignationUpdate/<int:id>/', views_Designation.DesignationUpdate),
    # -----------------Admin Roles------------------
    path('Admin/Roles/', views_Role.Roles),
    path('Admin/RoleCreate/', views_Role.RoleCreate),
    path('Admin/RoleUpdate/<int:id>/', views_Role.RoleUpdate),
    path('Admin/RoleDelete/<int:id>/', views_Role.RoleDelete),
    # -----------------Admin Roles------------------
    # -----------------Admin Designations------------------

    # path('api/assign_employee/',views.assign_employee),
    # path('api/my_assigments/', views.my_assigments),
    # path('api/update_status/<int:id>/', views.update_status),
    # path('api/update_sell_product_status/<int:id>/', views.upated_sell_product_status),

    # ---------Admin--------------
    path('Admin/UsersReports/',views_Reports.UsersReports),
    path('Admin/UserCreate/', views_Reports.UserCreate),
    # ---------Admin--------------

    # path('api/get_delivered_Ewaste/', views.get_delivered_Ewaste),
    # path('api/technician_assignmet/<int:Ewaste_id>/', views.technician_assignmet),
    # path('api/get_technicain_ewaste/', views.get_technicain_ewaste),
    # path('api/get_repaired_ewaste/', views.get_repaired_ewaste),
    
    
]

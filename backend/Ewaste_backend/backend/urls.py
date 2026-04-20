from django.urls import path
from . import views

urlpatterns = [
    path('api/register/', views.register),
    path('api/login/', views.login),
    path('api/sell/', views.sell),
    path('api/get_all_sell_request/', views.get_all_sell_requests),
    path('api/get_employees/', views.get_employees),
    path('api/add_employee/', views.add_employee),
    path('api/delete_employee/<int:id>/', views.delete_employee),
    path('api/get_collector/',views.get_collector),
    path('api/assign_employee/',views.assign_employee),
    path('api/my_assigments/', views.my_assigments),
    path('api/update_status/<int:id>/', views.update_status),
    path('api/update_sell_product_status/<int:id>/', views.upated_sell_product_status),
    path('api/get_users/',views.get_all_users),
    path('api/get_delivered_Ewaste/', views.get_delivered_Ewaste),
    path('api/technician_assignmet/<int:Ewaste_id>/', views.technician_assignmet),
    path('api/get_technicain_ewaste/', views.get_technicain_ewaste),
    path('api/get_repaired_ewaste/', views.get_repaired_ewaste),
    
    
]

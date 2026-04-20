import jwt
import os
from rest_framework.response import Response
from rest_framework import status
from dotenv import load_dotenv
from .models import *

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')

# Set role permission per URL
URL_ROLES = {
    '/api/sell/': ['user'],
    '/api/admin/': ['admin'],
    '/api/employee/': ['technician', 'collector'],
    '/api/get_employees/': ['admin'],
    '/api/add_employee/': ['admin'],
    '/api/delete_employee/': ['admin'],
    '/api/get_all_sell_request/': ['admin'],
    '/api/get_collector/': ['admin'],
    '/api/assign_employee/': ['admin'],
    '/api/my_assignments/': ['technician', 'collector'],
    '/api/my_assigments/': ['technician', 'collector'],
    '/api/update_status/': ['technician', 'collector'],
    '/api/update_assignment_status/': ['collector'],
    '/api/get_delivered_Ewaste/'  :['technician'],
    '/api/technician_assignmet/'  :['technician'],
    '/api/get_technicain_ewaste/'  :['technician'],
    '/api/get_repaired_ewaste/'  :['admin']
}


def check_permission(func):
    def wrapper(request, *args, **kwargs):
        required_roles = URL_ROLES.get(request.path.rstrip('0123456789').rstrip('/')+'/')
        if not required_roles:
            required_roles = URL_ROLES.get(request.path)
        if not required_roles:
            # try stripping the last path segment for URLs with IDs
            parts = request.path.rstrip('/').rsplit('/', 1)
            if parts[0]:
                required_roles = URL_ROLES.get(parts[0] + '/')

        if not required_roles:
            return func(request, *args, **kwargs)

        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return Response({'message': 'No token'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except:
            return Response({'message': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

        if not payload.get('role'):
            return Response({'message': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

        if payload['role'] not in required_roles:
            return Response({'message': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        request.user_obj = payload
        return func(request, *args, **kwargs)

    wrapper.__name__ = func.__name__
    return wrapper

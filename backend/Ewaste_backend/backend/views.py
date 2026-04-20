from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serilalizers import *
from .middleware import check_permission
from django.db.models import Q
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password, check_password
import jwt
import os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')

# Create your views here.
@api_view(['POST'])
def register(request):
    try:
        data = request.data.copy()
        data['password'] = make_password(data['password'])
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        print('email:', email, 'password:', password)
        user = users.objects.get(email=email)
        print('user found:', user)
        if user and check_password(password, user.password):
            payload = {
                "user_id": user.id,
                "email": user.email,
                "role": user.role
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            return Response({'message': 'Login successful', 'token': token}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except users.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@check_permission
def sell(request):
    try:
        data = request.data.copy()
        data['user_id'] = request.user_obj['user_id']
        serializer = EwasteProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@check_permission
def get_employees(request):
    try:
        employees = users.objects.filter(Q(role='technician') | Q(role='collector'))
        serializer = UserSerializer(employees, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'msg': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@check_permission
def get_all_sell_requests(request):
    try:
        sell_requests = Ewaste_product.objects.all()
        serializer = EwasteProductSerializer(sell_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'msg':str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['DELETE'])
@check_permission
def delete_employee(request, id):
    print('delete hit ')
    try:
        user = users.objects.get(id=id)
        print('user',user)
        user.delete()
        return Response({'message': 'Employee deleted'}, status=status.HTTP_200_OK)
    except users.DoesNotExist:
        return Response({'message': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@check_permission
def add_employee(request):
    try:
        data = request.data.copy()
        raw_password = data['password']
        data['password'] = make_password(raw_password)
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            send_mail(
                subject='Welcome to EcoCycle',
                message=f"Hi {data['name']},\n\nYour account has been created.\n\nEmail: {data['email']}\nPassword: {raw_password}\n\nPlease login and change your password.",
                from_email=os.getenv('EMAIL_HOST_USER'),
                recipient_list=[data['email']],
                fail_silently=False,
            )
            return Response({'message': serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@check_permission
def get_collector(request):
    try:
        collectors=users.objects.filter(role='collector')
        serialzer=UserSerializer(collectors,many=True)
        return Response({'collectors':serialzer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'msg':str(e)},status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@check_permission
def my_assignments(request):
    try:
        employee_id = request.user_obj['user_id']
        requests_qs = Ewaste_product.objects.filter(assigned_employee_id=employee_id)
        serializer = EwasteProductSerializer(requests_qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'msg': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@check_permission
def assign_employee(request):
    try:
        sell_request_id = request.data.get('sell_request_id')
        employee_id = request.data.get('employee_id')
        sell_request = Ewaste_product.objects.get(id=sell_request_id)
        employee = users.objects.get(id=employee_id)
        sell_request.assigned_employee_id = employee
        sell_request.save()

        return Response({'message': 'Employee assigned successfully'}, status=status.HTTP_200_OK)
    except Ewaste_product.DoesNotExist:
        return Response({'message': 'Sell request not found'}, status=status.HTTP_404_NOT_FOUND)
    except users.DoesNotExist:
        return Response({'message': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@check_permission
def update_status(request, id):
    try:
        sell_request = Ewaste_product.objects.get(id=id)
        sell_request.status = request.data.get('status')
        price = request.data.get('price')
        if price not in (None, ''):
            sell_request.price = price
        sell_request.save()
        return Response({'message': 'Status updated'}, status=status.HTTP_200_OK)
    except Ewaste_product.DoesNotExist:
        return Response({'message': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@check_permission
def my_assigments(request):
    try:
        user_id=request.user_obj['user_id']
        assigned_sell_requests=Ewaste_product.objects.filter(assigned_employee_id=user_id)
        serializer=EwasteProductSerializer(assigned_sell_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'msg':str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@check_permission
def upated_sell_product_status(request, id):
    try:
        sell_request_obj = Ewaste_product.objects.get(id=id)
        new_status = request.data.get('status')
        price = request.data.get('price')
        sell_request_obj.status = new_status
        sell_request_obj.price = price
        sell_request_obj.save()
        return Response({'message': 'Updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_500_BAD_REQUEST)
    
@api_view(['GET'])
@check_permission
def get_all_users(request):
    try:
        users_obj=users.objects.filter(role='user')
        serializer=UserSerializer(users_obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message':str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_delivered_Ewaste(request):
    try:
        delivered_e_waste=Ewaste_product.objects.filter(status='delivered')
        serializer=EwasteProductSerializer(delivered_e_waste, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message':str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@check_permission
def technician_assignmet(request, Ewaste_id):
    try:
        product = Ewaste_product.objects.get(id=Ewaste_id)
        new_status = request.data.get('status')
        user_id = request.user_obj['user_id']
        user = users.objects.get(id=user_id)
        product.status = new_status
        product.assigned_technitian_id = user
        product.save()
        return Response({'message': 'technician assigned', 'user_name': user.name}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@check_permission
def get_technicain_ewaste(request):
    try:
        user_id=request.user_obj['user_id']
        technician_ewaste=Ewaste_product.objects.filter(assigned_technitian_id=user_id)
        serializer=EwasteProductSerializer(technician_ewaste, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message':str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@check_permission
def get_repaired_ewaste(request):
    try:
        repaired_ewaste=Ewaste_product.objects.filter(status='repaired')
        serialzer=EwasteProductSerializer(repaired_ewaste,many=True)
        return Response(serialzer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message':str(e)}, status=status.HTTP_400_BAD_REQUEST)
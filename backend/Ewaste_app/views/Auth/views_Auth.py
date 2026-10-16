from django.shortcuts import render
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ...serilalizers import *
# from .middleware import check_permission
from django.db.models import Q
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password, check_password
import jwt
import traceback
import os

# Use the project key by default; allow a dedicated JWT key from the environment.
SECRET_KEY = os.getenv('SECRET_KEY') or settings.SECRET_KEY

# Create your views here.
@api_view(['POST'])
def Register(request):
    try:
        data = request.data.copy()
        # The signup form calls this field Name; the model uses UserName.

        data['Password'] = make_password(data['Password'])
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def Login(request):
    try:
        Email = request.data.get('Email')
        Password = request.data.get('Password')
        if not Email or not Password:
            return Response(
                {'message': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = Users.objects.get(Email=Email)
        if check_password(Password, user.Password):
            payload = {
                "user_id": user.id,
                "email": user.Email,
                # The Users model currently has no role field.
                "role":  user.Role,
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            return Response({'message': 'Login successful', 'token': token}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Users.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

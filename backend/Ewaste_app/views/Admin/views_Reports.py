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
from ...models import Users, Role


@api_view(['GET'])
# @check_permission
def UsersReports(request):
    try:
        Users_obj=Users.objects.filter(Role='user')
        serializer=UserSerializer(Users_obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        traceback.print_exc()
        return Response({'message':str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def UserCreate(request):
    """Create a platform user from the admin user form."""
    data = request.data.copy()
    password = data.get('Password')
    if not password:
        return Response({'Password': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
    role_name = (data.get('Role') or '').strip()
    if not Role.objects.filter(RoleName__iexact=role_name).exists():
        return Response({'Role': ['Select a valid role.']}, status=status.HTTP_400_BAD_REQUEST)
    data['Role'] = role_name
    if Users.objects.filter(Email=data.get('Email')).exists():
        return Response({'Email': ['A user with this email already exists.']}, status=status.HTTP_400_BAD_REQUEST)
    data['Password'] = make_password(password)
    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        response_data = UserSerializer(user).data
        response_data.pop('Password', None)
        return Response(response_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

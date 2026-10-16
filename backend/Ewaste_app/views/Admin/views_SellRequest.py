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
from ...models import EwasteProduct,Users


@api_view(['GET'])
# @check_permission
def SellRequests(request):
    try:
        sell_requests = EwasteProduct.objects.all()
        serializer = EwasteProductSerializer(sell_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'msg':str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
# @check_permission
def CollectorAutocomplete(request):
    try:
        collectors_obj = Users.objects.filter(Role__iexact='collector')
        serializer = UserSerializer(collectors_obj, many=True)
        return Response({'collectors': serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'msg': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



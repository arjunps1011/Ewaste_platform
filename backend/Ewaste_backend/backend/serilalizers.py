from .models import *
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = '__all__'

class EwasteProductSerializer(serializers.ModelSerializer):
    assigned_technitian_id = UserSerializer(read_only=True)

    class Meta:
        model = Ewaste_product
        fields = '__all__'
       


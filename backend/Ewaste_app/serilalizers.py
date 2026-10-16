from .models import *
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'

class EwasteProductSerializer(serializers.ModelSerializer):
    assigned_technitian_id = UserSerializer(read_only=True)

    class Meta:
        model = EwasteProduct
        fields = '__all__'
        extra_kwargs = {
            'ProductBrand': {'allow_blank': True},
            'ProductModel': {'allow_blank': True},
        }
       
class EmlpoyeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


class EmployeeReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = vw_Employee_Report
        fields = '__all__'


class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = '__all__'


class RoleSerializer(serializers.ModelSerializer):
    RoleName = serializers.CharField(max_length=100, allow_blank=False, allow_null=False, trim_whitespace=True)

    class Meta:
        model = Role
        fields = '__all__'
        read_only_fields = ('RoleCode', 'CreatedAt', 'UpdatedAt')


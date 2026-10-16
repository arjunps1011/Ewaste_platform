from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import Employee, vw_Employee_Report
from ...serilalizers import EmployeeReportSerializer, EmlpoyeeSerializer


@api_view(['GET'])
def Employees(request):
    """Return employee records, with optional text search."""
    employees = vw_Employee_Report.objects.all().order_by('id')
    search = request.query_params.get('search', '').strip()
    if search:
        employees = employees.filter(
            Q(EmployeeName__icontains=search)
            | Q(Qualification__icontains=search)
            | Q(EmergencyContact__icontains=search)
        )
    return Response(EmployeeReportSerializer(employees, many=True).data, status=status.HTTP_200_OK)
@api_view(['POST'])
def EmployeeCreate(request):
    serializer = EmlpoyeeSerializer(data=request.data)
    if serializer.is_valid():
        employee = serializer.save()
        return Response(EmlpoyeeSerializer(employee).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
def EmployeeUpdate(request, id):
    try:
        employee = Employee.objects.get(pk=id)
    except Employee.DoesNotExist:
        return Response({'message': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = EmlpoyeeSerializer(employee, data=request.data, partial=request.method == 'PATCH')
    if serializer.is_valid():
        employee = serializer.save()
        return Response(EmlpoyeeSerializer(employee).data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

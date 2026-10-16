from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import Designation
from ...serilalizers import DesignationSerializer


@api_view(['GET'])
def Designations(request):
    designations = Designation.objects.all().order_by('id')
    return Response(DesignationSerializer(designations, many=True).data, status=status.HTTP_200_OK)


@api_view(['POST'])
def DesignationCreate(request):
    serializer = DesignationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    last_designation = Designation.objects.all().order_by('-DisgnationCode').first()
    last_code = int(last_designation.DisgnationCode) if last_designation and last_designation.DisgnationCode else 0

    designation = serializer.save(DisgnationCode=str(last_code + 1))
    return Response(DesignationSerializer(designation).data, status=status.HTTP_201_CREATED)


@api_view(['PUT', 'PATCH'])
def DesignationUpdate(request, id):
    try:
        designation = Designation.objects.get(pk=id)
    except Designation.DoesNotExist:
        return Response({'message': 'Designation not found.'}, status=status.HTTP_404_NOT_FOUND)

    if 'DesignationName' not in request.data:
        return Response({'DesignationName': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)

    # Keep the generated code and creation date unchanged during edits.
    serializer = DesignationSerializer(
        designation,
        data={'DesignationName': request.data.get('DesignationName')},
        partial=True,
    )
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    designation = serializer.save()
    return Response(DesignationSerializer(designation).data, status=status.HTTP_200_OK)

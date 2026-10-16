from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ...models import Role
from ...serilalizers import RoleSerializer


@api_view(['GET'])
def Roles(request):
    roles = Role.objects.all().order_by('id')
    search = request.query_params.get('search', '').strip()
    if search:
        roles = roles.filter(RoleName__icontains=search)
    return Response(RoleSerializer(roles, many=True).data, status=status.HTTP_200_OK)


@api_view(['POST'])
def RoleCreate(request):
    serializer = RoleSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    last_role = Role.objects.all().order_by('-RoleCode').first()
    last_code = int(last_role.RoleCode) if last_role and last_role.RoleCode else 0

    role = serializer.save(RoleCode=str(last_code + 1))
    return Response(RoleSerializer(role).data, status=status.HTTP_201_CREATED)


@api_view(['PUT', 'PATCH'])
def RoleUpdate(request, id):
    try:
        role = Role.objects.get(id=id)
    except Role.DoesNotExist:
        return Response({'message': 'Role not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = RoleSerializer(role, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    role = serializer.save()
    return Response(RoleSerializer(role).data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def RoleDelete(request, id):
    try:
        role = Role.objects.get(pk=id)
    except Role.DoesNotExist:
        return Response({'message': 'Role not found.'}, status=status.HTTP_404_NOT_FOUND)
    role.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

import os
import jwt
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ...models import EwasteProduct, Users
import traceback


@api_view(['POST'])
def Sell(request):
    try:
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.replace('Bearer ', '', 1)
        if not token:
            return Response({'message': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        secret_key = os.getenv('SECRET_KEY') or settings.SECRET_KEY
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        user = Users.objects.get(id=payload['user_id'])

        data = request.data
        if isinstance(data, list) and not data:
            return Response({'message': 'Add at least one item to submit.'}, status=status.HTTP_400_BAD_REQUEST)

        if isinstance(data, list):
            created = []
            for item in data:
                product = EwasteProduct.objects.create(
                    UserId=user,
                    Product=item.get('category', item.get('product', '')),
                    ProductBrand=item.get('brand', item.get('product_brand', '')),
                    ProductModel=item.get('model', item.get('product_model', '')),
                    ProductQuantity=item.get('qty', item.get('product_quantity', 1)),
                    ProductDescription=item.get('condition', item.get('product_description', '')),
                    UserName=item.get('name', item.get('user_name', '')),
                    Phone=item.get('phone', ''),
                    Address=item.get('address', ''),
                )
                created.append(product)
        else:
            product = EwasteProduct.objects.create(
                UserId=user,
                Product=data.get('category', data.get('product', '')),
                ProductBrand=data.get('brand', data.get('product_brand', '')),
                ProductModel=data.get('model', data.get('product_model', '')),
                ProductQuantity=data.get('qty', data.get('product_quantity', 1)),
                ProductDescription=data.get('condition', data.get('product_description', '')),
                UserName=data.get('name', data.get('user_name', '')),
                Phone=data.get('phone', ''),
                Address=data.get('address', ''),
            )
            created = [product]

        return Response(
            {'message': 'Sell request(s) created.', 'ids': [item.id for item in created]},
            status=status.HTTP_201_CREATED,
        )
    except (jwt.InvalidTokenError, KeyError, Users.DoesNotExist):
        return Response({'message': 'Invalid or expired authentication token.'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        traceback.print_exc()
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

from django.db import models

# Create your models here.
class users(models.Model):
    ROLE_CHOICES = [('user', 'User'), ('admin', 'Admin'), ('technician', 'Technician'),('collector','Collector')]
    name=models.CharField(max_length=100)
    email=models.CharField(max_length=100)
    phone=models.IntegerField()
    address=models.CharField(max_length=100)
    password=models.CharField(max_length=100)
    role=models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')

class Ewaste_product(models.Model):
    TYPE_CHOICES = [('sell', 'Sell'), ('buy', 'Buy')]
    user_id=models.ForeignKey(users, on_delete=models.CASCADE, related_name='sell_requests')
    assigned_employee_id=models.ForeignKey(users, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_requests')
    product=models.CharField(max_length=100)
    assigned_technitian_id=models.ForeignKey(users, on_delete=models.SET_NULL, null=True, blank=True, related_name='products_to_test')
    product_brand=models.CharField(max_length=100)
    product_model=models.CharField(max_length=100)
    product_quantity=models.IntegerField()
    product_description=models.CharField(max_length=100)
    user_name=models.CharField(max_length=100)
    phone=models.PositiveIntegerField()
    address=models.CharField(max_length=100)
    status=models.CharField(max_length=100, default='pending')
    price=models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sell_price=models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    type=models.CharField(max_length=10, choices=TYPE_CHOICES, default='buy')
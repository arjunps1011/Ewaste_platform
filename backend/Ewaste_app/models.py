from django.db import models

# Create your models here.


from django.db import models





class Designation(models.Model):
    DisgnationCode=models.CharField(max_length=100,null=True,blank=True)
    DesignationName=models.CharField(max_length=100,null=True,blank=True)
    CreatedAt=models.DateField(auto_now_add=True)
    UpdatedAt=models.DateField(auto_now_add=True)
    
    class Meta:
        db_table = 'Designation'

class vw_Employee_Report(models.Model):
    EmployeeName=models.CharField(max_length=20,null=True, blank=True)
    JoiningDate = models.DateField()
    DateOfBirth = models.DateField(null=True, blank=True)
    Gender = models.CharField(max_length=20, blank=True, default='')
    EmergencyContact = models.CharField(max_length=20, blank=True, default='')
    Salary = models.DecimalField(max_digits=10, decimal_places=2)
    EmploymentStatus = models.CharField(max_length=20, default='active')
    Qualification = models.CharField(max_length=100, blank=True, default='')
    ProfileImage = models.ImageField(upload_to='employee_profiles/', null=True, blank=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    Designaion_id = models.IntegerField(null=True, blank=True)
    DesingationName=models.CharField(max_length=200,null=True,blank=True)
    
    class Meta:
        db_table = 'vw_Employee_Report'
        managed = False



class Employee(models.Model):

    EmployeeName=models.CharField(max_length=20,null=True, blank=True)
    JoiningDate = models.DateField()
    DateOfBirth = models.DateField(null=True, blank=True)
    Gender = models.CharField(max_length=20, blank=True, default='')
    EmergencyContact = models.CharField(max_length=20, blank=True, default='')
    Salary = models.DecimalField(max_digits=10, decimal_places=2)
    EmploymentStatus = models.CharField(max_length=20, default='active')
    Qualification = models.CharField(max_length=100, blank=True, default='')
    ProfileImage = models.ImageField(upload_to='employee_profiles/', null=True, blank=True)
    CreatedAt = models.DateTimeField(auto_now_add=True)
    UpdatedAt = models.DateTimeField(auto_now=True)
    Designaion = models.ForeignKey( Designation,
        on_delete=models.SET_NULL,
        related_name='Designation',
        null=True,
        blank=True,)

    class Meta:
        db_table = "Employee"



class Role(models.Model):
    RoleCode=models.CharField(max_length=100,null=True,blank=True)
    RoleName=models.CharField(max_length=100,null=True,blank=True)
    CreatedAt=models.DateField(auto_now_add=True)
    UpdatedAt=models.DateField(auto_now=True)
    
    class Meta:
        db_table = 'Role'



# Create your models here.
class Users(models.Model):

    Name = models.CharField(max_length=100)
    Email = models.CharField(max_length=100)
    Phone = models.CharField(max_length=20, blank=True, default='')
    Address = models.CharField(max_length=255, blank=True, default='')
    Password = models.CharField(max_length=100)
    Role = models.CharField(max_length=100,default='user')
    EmpId = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        related_name='users',
        null=True,
        blank=True,
    )
    

    class Meta:
        db_table = "Users"



class EwasteProduct(models.Model):
    AssignedEmployeeId = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_requests')
    Product = models.CharField(max_length=100)
    AssignedTechnitianId = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True, blank=True, related_name='products_to_test')
    ProductBrand = models.CharField(max_length=100)
    ProductModel = models.CharField(max_length=100)
    ProductQuantity = models.IntegerField()
    ProductDescription = models.CharField(max_length=100)
    UserName = models.CharField(max_length=100)
    Phone = models.CharField(max_length=20, blank=True, default='')
    Address = models.CharField(max_length=100)
    Status = models.CharField(max_length=100, default='pending')
    Price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    SellPrice = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    Type = models.CharField(max_length=10, default='buy')

    class Meta:
        db_table = "EwasteProduct"









    



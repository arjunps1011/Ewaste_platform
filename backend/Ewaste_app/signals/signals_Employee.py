from django.db import connections
from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def create_employee_report_view(sender, using, **kwargs):
    """Create or replace the employee report view after migrations."""
    if sender.label != 'Ewaste_app':
        return

    connection = connections[using]
    quote = connection.ops.quote_name
    employee_table = quote('Employee')
    designation_table = quote('Designation')
    view_table = quote('vw_Employee_Report')

    with connection.cursor() as cursor:
        cursor.execute(
            f'''CREATE OR REPLACE VIEW {view_table} AS
                SELECT
                    employee.id,
                    employee.EmployeeName,
                    employee.JoiningDate,
                    employee.DateOfBirth,
                    employee.Gender,
                    employee.EmergencyContact,
                    employee.Salary,
                    employee.EmploymentStatus,
                    employee.Qualification,
                    employee.ProfileImage,
                    employee.CreatedAt,
                    employee.UpdatedAt,
                    employee.Designaion_id,
                    designation.DesignationName AS DesingationName
                FROM {employee_table} AS employee
                LEFT JOIN {designation_table} AS designation
                    ON employee.Designaion_id = designation.id'''
        )

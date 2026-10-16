from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Ewaste_app', '0006_employee'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employee',
            name='UserId',
        ),
    ]

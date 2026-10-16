from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Ewaste_app', '0012_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='role',
            name='UpdatedAt',
            field=models.DateField(auto_now=True),
        ),
    ]

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Ewaste_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='Phone',
            field=models.CharField(blank=True, default='', max_length=20),
        ),
        migrations.AddField(
            model_name='users',
            name='Address',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
    ]

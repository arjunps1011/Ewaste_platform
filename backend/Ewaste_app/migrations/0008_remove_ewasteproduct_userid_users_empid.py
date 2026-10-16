import django.db.models.deletion
from django.db import migrations, models


def _has_column(schema_editor, model, field_name):
    table_name = model._meta.db_table
    with schema_editor.connection.cursor() as cursor:
        columns = schema_editor.connection.introspection.get_table_description(cursor, table_name)
    return any(column.name.lower() == model._meta.get_field(field_name).column.lower() for column in columns)


class AddFieldIfMissing(migrations.AddField):
    """Allow retrying this migration after a non-atomic MySQL partial failure."""

    def database_forwards(self, app_label, schema_editor, from_state, to_state):
        model = to_state.apps.get_model(app_label, self.model_name)
        if not _has_column(schema_editor, model, self.name):
            super().database_forwards(app_label, schema_editor, from_state, to_state)


class RemoveFieldIfPresent(migrations.RemoveField):
    """Skip a column removal already completed before a failed migration."""

    def database_forwards(self, app_label, schema_editor, from_state, to_state):
        model = from_state.apps.get_model(app_label, self.model_name)
        if _has_column(schema_editor, model, self.name):
            super().database_forwards(app_label, schema_editor, from_state, to_state)


class Migration(migrations.Migration):

    dependencies = [
        ('Ewaste_app', '0007_remove_employee_userid'),
    ]

    operations = [
        AddFieldIfMissing(
            model_name='users',
            name='EmpId',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='users',
                to='Ewaste_app.employee',
            ),
        ),
        RemoveFieldIfPresent(
            model_name='ewasteproduct',
            name='UserId',
        ),
    ]

from django.apps import AppConfig


class EwasteAppConfig(AppConfig):
    name = 'Ewaste_app'

    def ready(self):
        from .signals import signals_Employee  # noqa: F401

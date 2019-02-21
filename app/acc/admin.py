from django.apps import apps
from django.contrib import admin
from .apps import AccConfig

# Register your models here.

# get app name
name = AccConfig.name.split('.')[-1]
app = apps.get_app_config(name)

# register model
for model_name, model in app.models.items():
    admin.site.register(model)

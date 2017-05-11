from .views import *
from django.conf.urls import url
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'sistemas', SistemasViewSet)
router.register(r'grupo', GrupoViewSet)

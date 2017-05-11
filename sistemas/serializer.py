from .models import Sistemas, Grupo
from rest_framework import routers, serializers, viewsets


class SistemasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sistemas
        fields = '__all__'


class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grupo
        fields = '__all__'

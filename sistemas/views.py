from django.shortcuts import render

# Create your views here.
from rest_framework import generics, viewsets
from .serializer import SistemasSerializer, GrupoSerializer
from .models import Sistemas, Grupo


class SistemasViewSet(viewsets.ModelViewSet):
    serializer_class = SistemasSerializer
    queryset = Sistemas.objects.all()


class GrupoViewSet(viewsets.ModelViewSet):
    serializer_class = GrupoSerializer
    queryset = Grupo.objects.all()

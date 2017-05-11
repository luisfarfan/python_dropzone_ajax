from django.db import models


# Create your models here.
class Sistemas(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=255)
    sigla = models.CharField(max_length=10, null=True, blank=True)
    fecha_inicio = models.CharField(max_length=20, null=True, blank=True)
    fecha_fin = models.CharField(max_length=20, null=True, blank=True)
    grupo = models.ForeignKey('Grupo', null=True, blank=True)


class Modulos(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=255)
    sistema = models.ForeignKey('Sistemas')


class Observacion(models.Model):
    descripcion = models.CharField(max_length=255)
    modulo = models.ForeignKey('Modulos')


class Grupo(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=255)
    trabajadores = models.ManyToManyField('Trabajador', through='GrupoTrabajadores')


class GrupoTrabajadores(models.Model):
    grupo = models.ForeignKey(Grupo)
    trabajador = models.ForeignKey('Trabajador')


class Trabajador(models.Model):
    nombre_completo = models.CharField(max_length=255)
    cargo = models.ForeignKey('Cargo')


class Cargo(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=255)

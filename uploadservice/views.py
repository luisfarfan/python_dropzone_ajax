from django.shortcuts import render
import pandas as pd
from django.http import JsonResponse
from django.views import View

from .forms import ExcelForm
from .models import Excel
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


# Create your views here.


def readExcel(request):
    df = pd.read_excel(('static/excel2.xls'))
    readed = df.as_matrix()
    return JsonResponse(readed.tolist(), safe=False)


class UploadView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(UploadView, self).dispatch(*args, **kwargs)

    def get(self, request):
        photos_list = Excel.objects.all().values()
        return JsonResponse(list(photos_list), safe=False)

    def post(self, request):
        form = ExcelForm(self.request.POST, self.request.FILES)
        if form.is_valid():
            photo = form.save()
            data = {'is_valid': True, 'name': photo.file.name, 'url': photo.file.url}
        else:
            data = {'is_valid': False}
        return JsonResponse(data)

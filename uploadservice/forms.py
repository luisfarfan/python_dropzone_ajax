from django import forms

from .models import Excel


class ExcelForm(forms.ModelForm):
    class Meta:
        model = Excel
        fields = ('file',)

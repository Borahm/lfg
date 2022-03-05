from django.urls import path

from .views import RequestListView, RequestDetailView

urlpatterns = [
    path('', RequestListView.as_view()),
    path('<int:pk>/', RequestDetailView.as_view())
]

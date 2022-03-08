from django.urls import path  # import path method to set a path for a request
from .views import RequestListView, RequestDetailView  # import view

urlpatterns = [
    path('', RequestListView.as_view()),
    path('<int:pk>/', RequestDetailView.as_view())
]

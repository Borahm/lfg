from django.urls import URLPattern, path
from .views import ProjectListView, ProjectDetailView

urlpatterns = [
    path('', ProjectListView.as_view()),
    path('<int:pk>/', ProjectDetailView.as_view()),
]

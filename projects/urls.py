from django.urls import URLPattern, path
from .views import ProjectListView, ProjectDetailView, PostListView

urlpatterns = [
    path('', ProjectListView.as_view()),
    path('<int:pk>/', ProjectDetailView.as_view()),
    path('posts/', PostListView.as_view()),

]

from django.urls import path  # import path method to set a path for a request
from .views import PostListView, PostDetailView  # import view

urlpatterns = [
    path('', PostListView.as_view()),
    path('<int:pk>/', PostDetailView.as_view())
]

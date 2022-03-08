from django.urls import path  # import path method to set a path for a request
from .views import MemberListView, MemberDetailView  # import view

urlpatterns = [
    path('', MemberListView.as_view()),
    path('<int:pk>/', MemberDetailView.as_view())
]

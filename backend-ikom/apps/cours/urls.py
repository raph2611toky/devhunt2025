from django.urls import path
from apps.cours.views import CourseCreateAPIView, EtapeCreateAPIView, EtapeListAPIView, InterrogationCreateAPIView, InterrogationListAPIView, CoursePublishAPIView


urlpatterns = [
    path('create', CourseCreateAPIView.as_view(), name='course-create'),
    path('etapes/', EtapeCreateAPIView.as_view(), name='etape-create'),
    path('etapes/<int:cours_id>/', EtapeListAPIView.as_view(), name='etape-list'), 
    path('interrogations/', InterrogationCreateAPIView.as_view(), name='interrogation-create'),
    path('interrogations/<int:etape_id>/', InterrogationListAPIView.as_view(), name='interrogation-list'), 
    path('publier/', CoursePublishAPIView.as_view(), name='cours-publier'),
    
]

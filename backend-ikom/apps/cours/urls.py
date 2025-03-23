from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from apps.cours.views import CourseCreateAPIView, EtapeCreateAPIView, EtapeListAPIView, InterrogationCreateAPIView, InterrogationListAPIView, CoursePublishAPIView,\
     CourseListAPIView, CourseDetailAPIView, FromVideoAPIView, FromPdfAPIView


urlpatterns = [
    path('cours/create/', CourseCreateAPIView.as_view(), name='course-create'),
    path('cours/etapes/create/', EtapeCreateAPIView.as_view(), name='etape-create'),
    path('cours/etapes/<int:cours_id>/', EtapeListAPIView.as_view(), name='etape-list'), 
    path('cours/interrogations/', InterrogationCreateAPIView.as_view(), name='interrogation-create'),
    path('cours/interrogations/<int:etape_id>/', InterrogationListAPIView.as_view(), name='interrogation-list'), 
    path('cours/publier/', CoursePublishAPIView.as_view(), name='cours-publier'),
    path('cours/list/', CourseListAPIView.as_view(), name="list all courses"),
    path('cours/details/<int:id_cours>/', CourseDetailAPIView.as_view(), name="cours details"),
    path('traductions/from-video/', FromVideoAPIView.as_view(), name="traduction from video"),
    path('traductions/from-pdf/', FromPdfAPIView.as_view(), name='traduction from pdf'),
]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from apps.user.views import ProfileView, LoginView,LogoutView,RegisterView, RegisterFaceView, LoginFaceView

urlpatterns = [
    path('profile/',ProfileView.as_view(),name="profile"),#GET
    path('login/',LoginView.as_view(),name="login"),#POST
    path('register/',RegisterView.as_view(),name="register"),#POST
    path('login/face/', LoginFaceView.as_view(), name="login face"),# POST
    path('register/face/', RegisterFaceView.as_view(), name="register_view"),#POST
    path('logout/',LogoutView.as_view(),name='logout'),#PUT
] 
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
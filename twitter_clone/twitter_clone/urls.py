from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.conf.urls.static import static
from django.conf import settings
from tweets.views import CheckFollowStatusView ,TweetViewSet, RegisterView, UserProfileDetailView, CurrentUserView, FollowUserView, UnfollowUserView, UserTweetsView, LikeTweetView, NotificationListView, MarkNotificationAsReadView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r'tweets', TweetViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/profile/<str:username>/', UserProfileDetailView.as_view(), name='profile-detail'),
    path('api/user/', CurrentUserView.as_view(), name='current-user'),
    path('api/user/<str:username>/', UserProfileDetailView.as_view(), name='user_profile'),
    path('api/user/<str:username>/follow/', FollowUserView.as_view(), name='follow_user'),
    path('api/user/<str:username>/unfollow/', UnfollowUserView.as_view(), name='unfollow_user'),
    path('api/user/<str:username>/check-follow/', CheckFollowStatusView.as_view(), name='check_follow_status'),
    path('api/user/<str:username>/tweets/', UserTweetsView.as_view(), name='user_tweets'),
    path('api/tweets/<int:tweet_id>/like/', LikeTweetView.as_view(), name='like-tweet'),
    path('api/notifications/', NotificationListView.as_view(), name='notification-list'),
    path('api/notifications/<int:notification_id>/read/', MarkNotificationAsReadView.as_view(), name='mark-notification-as-read'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

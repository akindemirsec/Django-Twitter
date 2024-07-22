from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import TweetSerializer, UserSerializer, UserProfileSerializer, LikeSerializer, NotificationSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        profile_data = self.request.data
        user = serializer.save()
        UserProfile.objects.update_or_create(
            user=user,
            defaults={
                'bio': profile_data.get('bio', ''),
                'location': profile_data.get('location', ''),
                'birth_date': profile_data.get('birth_date', None),
                'profile_image': profile_data.get('profile_image', None)
            }
        )

class TweetViewSet(viewsets.ModelViewSet):
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}

class UserProfileDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        try:
            return User.objects.get(username=self.kwargs['username'])
        except User.DoesNotExist:
            raise NotFound('User not found')

    def get_serializer_context(self):
        return {'request': self.request}

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            raise NotFound('UserProfile not found')
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        try:
            user_to_follow = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound('User not found')
        
        profile = UserProfile.objects.get(user=request.user)
        profile_to_follow = UserProfile.objects.get(user=user_to_follow)

        profile.following.add(profile_to_follow)

        Notification.objects.create(
            user=user_to_follow,
            message=f'{request.user.username} started following you.',
            sender=request.user,
            sender_profile_image=request.user.userprofile.profile_image
        )

        return Response(status=status.HTTP_204_NO_CONTENT)

class UnfollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        try:
            user_to_unfollow = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound('User not found')
        
        profile = UserProfile.objects.get(user=request.user)
        profile_to_unfollow = UserProfile.objects.get(user=user_to_unfollow)

        profile.following.remove(profile_to_unfollow)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserTweetsView(generics.ListAPIView):
    serializer_class = TweetSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        username = self.kwargs['username']
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound('User not found')
        return Tweet.objects.filter(user=user).order_by('-created_at')


class LikeTweetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, tweet_id):
        try:
            tweet = Tweet.objects.get(id=tweet_id)
        except Tweet.DoesNotExist:
            raise NotFound('Tweet not found')

        like, created = Like.objects.get_or_create(user=request.user, tweet=tweet)

        if created:
            Notification.objects.create(
                user=tweet.user,
                message=f'{request.user.username} liked your tweet.',
                sender=request.user,
                sender_profile_image=request.user.userprofile.profile_image
            )

        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, tweet_id):
        try:
            tweet = Tweet.objects.get(id=tweet_id)
        except Tweet.DoesNotExist:
            raise NotFound('Tweet not found')

        try:
            like = Like.objects.get(user=request.user, tweet=tweet)
            like.delete()
        except Like.DoesNotExist:
            pass

        return Response(status=status.HTTP_204_NO_CONTENT)

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    def get_serializer_context(self):
        return {'request': self.request}

class MarkNotificationAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id, user=request.user)
            notification.is_read = True
            notification.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Notification.DoesNotExist:
            raise NotFound('Notification not found')

class TweetListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tweets = Tweet.objects.all().order_by('-created_at')
        serializer = TweetSerializer(tweets, many=True, context={'request': request})
        return Response(serializer.data)

class CheckFollowStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user_to_check = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound('User not found')
        
        profile = UserProfile.objects.get(user=request.user)
        profile_to_check = UserProfile.objects.get(user=user_to_check)
        is_following = profile.following.filter(user=user_to_check).exists()

        return Response({'is_following': is_following}, status=status.HTTP_200_OK)

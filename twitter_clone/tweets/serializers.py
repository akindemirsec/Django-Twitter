from rest_framework import serializers
from .models import Tweet, UserProfile, Like, Notification
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_image', 'bio', 'location', 'birth_date', 'followers', 'following']

class TweetSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    profile_image = serializers.ImageField(source='user.userprofile.profile_image', read_only=True)
    likes = serializers.IntegerField(source='like_set.count', read_only=True)
    liked = serializers.SerializerMethodField()

    class Meta:
        model = Tweet
        fields = ['id', 'user', 'content', 'created_at', 'profile_image', 'likes', 'liked']

    def get_liked(self, obj):
        request = self.context.get('request')
        if request and request.user and not request.user.is_anonymous:
            return Like.objects.filter(user=request.user, tweet=obj).exists()
        return False

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', read_only=True)
    tweets = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'profile', 'tweets']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def get_tweets(self, obj):
        request = self.context.get('request')
        tweets = Tweet.objects.filter(user=obj)
        return TweetSerializer(tweets, many=True, context={'request': request}).data

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'tweet', 'created_at']

class NotificationSerializer(serializers.ModelSerializer):
    sender_profile_image = serializers.ImageField(source='sender.userprofile.profile_image', read_only=True)
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    tweet_id = serializers.IntegerField(source='tweet.id', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'created_at', 'is_read', 'sender', 'sender_profile_image', 'sender_username', 'tweet_id']

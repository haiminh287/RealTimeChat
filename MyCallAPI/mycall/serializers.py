from rest_framework import serializers
from mycall.models import User, Connection,Message


class UserSerializer(serializers.ModelSerializer):
    # name = serializers.SerializerMethodField()
    # def get_thumbnail(self, user):
    #     if user.thumbnail:
    #         if user.thumbnail.name.startswith("http"):
    #             return user.thumbnail.name

    #         request = self.context.get('request')
    #         if request:
    #             return request.build_absolute_uri('/static/%s' % user.thumbnail.name)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name',
                  'username', 'password', 'thumbnail']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        data = validated_data.copy()
        user = User(**data)
        user.set_password(user.password)
        user.save()
        return user

    def update(self, instance, validated_data):
        data = validated_data.copy()
        if 'password' in data:
            data['password'] = instance.set_password(data['password'])
        return super().update(instance, data)


class UserStatusSerializer(UserSerializer):
    status = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    # thumbnail = serializers.SerializerMethodField(source ="thumbnail")

    class Meta:
        model = User
        fields = ['username', 'thumbnail', 'name', 'status']

    # def get_thumbnail(self, user):
    #     print(user.thumbnail)
    #     if user.thumbnail:
    #         return user.thumbnail.name
    #     return None
    def get_name(self, obj):
        fname = obj.first_name.capitalize()
        lname = obj.last_name.capitalize()
        return f'{fname} {lname}'

    def get_status(self, obj):
        print(obj)
        if hasattr(obj, 'pending_them') and obj.pending_them:
            return 'pending-them'
        elif hasattr(obj, 'pending_me') and obj.pending_me:
            return 'pending-me'
        elif hasattr(obj, 'connected') and obj.connected:
            return 'connected'
        return 'no-connected'


class ConnectionSerializer(serializers.ModelSerializer):
    sender = UserStatusSerializer()
    receiver = UserSerializer()

    class Meta:
        model = Connection
        fields = ['id', 'sender', 'receiver', 'created_at']


class FriendListSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()
    preview = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    class Meta:
        model = Connection
        fields = ['id', 'friend', 'preview', 'updated_at']

    def get_friend(self, obj):
        if self.context['user'] == obj.sender:
            return UserStatusSerializer(obj.receiver).data
        elif self.context['user'] == obj.receiver:
            return UserStatusSerializer(obj.sender).data
        else:
            print('Error :No user found')

    def get_preview(self, obj):
        if not hasattr(obj, 'latest_content'):
            return 'New Connections'
        return obj.latest_content
    
    def get_updated_at(self, obj):
        date = getattr(obj, 'latest_created_at', obj.updated_at)
        print('date',date)
        if date is None:
            return ''
        return date.isoformat()


class MessageSerializer(serializers.ModelSerializer):
    is_me = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'is_me', 'content', 'created_at']

    def get_is_me(self, obj):
        return self.context['user'] == obj.user
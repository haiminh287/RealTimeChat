from django.db import models
from django.contrib.auth.models import AbstractUser

def upload_thumbnail(instance, filename):
    path =  f'thumbnails/{instance.username}'
    extension = filename.split('.')[-1]
    if extension:
        path = f'{path}.{extension}'
    return path

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class User(AbstractUser):
    thumbnail = models.ImageField(upload_to=upload_thumbnail, blank=True, null=True)

class Connection(BaseModel):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_connections')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_connections')
    accepted = models.BooleanField(default=False)
    class Meta:
        unique_together = ['sender', 'receiver']

    def __str__(self):
        return f'{self.sender.username} -> {self.receiver.username}'
    

class Message(BaseModel):
    connection = models.ForeignKey(Connection, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_messages')
    content = models.TextField()

    def __str__(self):
        return f'{self.user.username} -> {self.content}'

# class ConversationMessage(models.Model):
#     conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
#     author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     class Meta:
#         ordering = ['id']

# class ConversationMessageStatus(models.Model):
#     message = models.ForeignKey(ConversationMessage, on_delete=models.CASCADE, related_name='statuses')
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message_statuses')
#     read = models.BooleanField(default=False)
#     delivered = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)
#     class Meta:
#         ordering = ['id']





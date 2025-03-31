from django.contrib import admin
from mycall.models import User
class MyChatAdmin(admin.AdminSite):
    site_header = 'MyChat Admin'
    site_title = 'MyChat Admin'
    index_title = 'MyChat Admin'

admin_site=MyChatAdmin(name='mychatadmin')
admin_site.register(User)


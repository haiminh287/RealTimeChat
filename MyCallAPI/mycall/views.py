from django.shortcuts import render
from rest_framework import viewsets,generics,permissions
from mycall import serializers,paginators
from rest_framework.response import Response
from mycall.models import User,Connection
from rest_framework.decorators import action,permission_classes
from django.http import HttpResponse
from django.shortcuts import render
from django.db.models import Q
from django.db.models import Exists, OuterRef

def index(request):
    return render(request, "index.html")

class UserViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    pagination_class = paginators.UserPaginator

    @action(methods=['get'], url_path='current_user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)
    
    def get_queryset(self):
        query = self.queryset
        print('request.user',self.request.user)
        kw = self.request.query_params.get('kw')
        if kw:
            query = query.filter(
                Q(username__icontains=kw) | 
                Q(first_name__icontains=kw) | 
                Q(last_name__icontains=kw)
            )
        query = query.exclude(username=self.request.user.username).annotate(
            pending_them=Exists(Connection.objects.filter(sender=self.request.user, receiver=OuterRef('id'), accepted=False)),
            pending_me=Exists(Connection.objects.filter(sender=OuterRef('id'), receiver=self.request.user, accepted=False)),
            connected=Exists(Connection.objects.filter(
                Q(sender=self.request.user, receiver=OuterRef('id')) | 
                Q(sender=OuterRef('id'), receiver=self.request.user), 
                accepted=True
            ))
        )
        return query
    
    @permission_classes([permissions.IsAuthenticated])
    def list(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=401)
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = serializers.UserStatusSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = serializers.UserStatusSerializer(queryset, many=True)
        return Response(serializer.data)
    
    

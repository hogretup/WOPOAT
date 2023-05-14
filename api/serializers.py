# in /api/serializers.py

from rest_framework.serializers import ModelSerializer

# Example of creating a Serializer:
"""
from .models import Note
class NoteSerializer(ModelSerializer):
    class Meta:
        model = Note
        fields = ['__all__'] # Serialize all the fields in a Note object
"""
# Now in our View functions we can do smth like 
# serializer = NoteSerializer(notes,many=), and return Response(serializer.data)

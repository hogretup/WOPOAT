# Generated by Django 4.2.1 on 2023-07-17 17:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_alter_userprofile_profile_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='displayName',
            field=models.TextField(null=True),
        ),
    ]

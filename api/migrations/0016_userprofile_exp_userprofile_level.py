# Generated by Django 4.2.1 on 2023-07-19 21:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_completedquiz_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='EXP',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='level',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]

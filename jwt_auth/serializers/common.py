from rest_framework import serializers
# password_validation provides the method to check the password meets the minimum requirements
from django.contrib.auth import get_user_model, password_validation
from django.core.exceptions import ValidationError
# hasher - convert plain text password into the hashed password that we add to the db
from django.contrib.auth.hashers import make_password

# User model
User = get_user_model()

# Serializers


class UserSerializer(serializers.ModelSerializer):
    # never converted into JSON and returned in response
    # so allows us to write to the db when posting, but won't return when being converted back
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data):
        print('DATA ---->', data)

        # Below we're removing password and password_confirmation from the data object passed by the user
        # We will then use them to validate the password and then return a hashed password at the end of this function
        password = data.pop('password')
        password_confirmation = data.pop('password_confirmation')

        # Check the passwords match
        if password != password_confirmation:
            raise ValidationError(
                {'password_confirmation': 'Does not match password'})

        try:
            password_validation.validate_password(password)
        except ValidationError as error:
            print(error)
            raise ValidationError({'password': error})

        data['password'] = make_password(password)
        print('HASHED PASSWORD --->', data['password'])
        return data

    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name",
                  "profile_image", "password", "password_confirmation")

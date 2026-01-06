# from core.utils.exceptions import ValidationError
# from core.utils.formatters import format_serializer_error
# from django.contrib.auth.hashers import check_password, make_password
# from rest_framework.exceptions import AuthenticationFailed
# from rest_framework.permissions import AllowAny
# from rest_framework.request import Request
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework_simplejwt.tokens import RefreshToken

# from accounts.models import User
# from accounts.serializers import UserSerializer


# class SignInView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request: Request):
#         email = request.data.get("email", "")
#         password = request.data.get("password", "")

#         if not email or not password:
#             raise ValidationError

#         user = User.objects.filter(email=email).first()

#         if not user:
#             raise AuthenticationFailed("Email e/ou senha inválido(s)")

#         if not check_password(password, user.password):
#             raise AuthenticationFailed("Email e/ou senha inválido(s)")

#         user_data = UserSerializer(user).data
#         access_token = RefreshToken.for_user(user).access_token

#         return Response({"user": user_data, "access_token": str(access_token)})


# class SignUpView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request: Request):
#         data = {
#             "name": request.data.get("name"),
#             "email": request.data.get("email"),
#             "password": request.data.get("password"),
#         }

#         serializer = UserSerializer(data=data)

#         if not serializer.is_valid():
#             raise ValidationError(format_serializer_error(serializer.errors))

#         user = User.objects.create(
#             name=data.get("name"),
#             email=data.get("email"),
#             password=make_password(data.get("password")),
#         )

#         access_token = RefreshToken.for_user(user).access_token

#         return Response(
#             {"user": UserSerializer(user).data, "access_token": str(access_token)}
#         )
from core.utils.exceptions import ValidationError
from core.utils.formatters import format_serializer_error
from django.contrib.auth.hashers import check_password, make_password
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User
from accounts.serializers import UserSerializer


class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request):
        email = request.data.get("email", "")
        password = request.data.get("password", "")

        if not email or not password:
            raise ValidationError("Email e senha são obrigatórios")

        user = User.objects.filter(email=email).first()

        if not user or not check_password(password, user.password):
            raise AuthenticationFailed("Email e/ou senha inválido(s)")

        access_token = RefreshToken.for_user(user).access_token

        # 🔑 FORMATO COMPATÍVEL COM NEXTAUTH (Credentials Provider)
        return Response(
            {
                "id": user.id,
                "name": getattr(user, "name", ""),
                "email": user.email,
                "access_token": str(access_token),
            }
        )


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request):
        data = {
            "name": request.data.get("name"),
            "email": request.data.get("email"),
            "password": request.data.get("password"),
        }

        serializer = UserSerializer(data=data)

        if not serializer.is_valid():
            raise ValidationError(format_serializer_error(serializer.errors))

        user = User.objects.create(
            name=data["name"],
            email=data["email"],
            password=make_password(data["password"]),
        )

        access_token = RefreshToken.for_user(user).access_token

        # 🔑 MESMO FORMATO DO SIGNIN
        return Response(
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "access_token": str(access_token),
            },
            status=201,  # ⚠️ IMPORTANTE para o frontend não acusar erro
        )

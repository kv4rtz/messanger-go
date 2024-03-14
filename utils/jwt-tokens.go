package utils

import (
	"errors"
	"github.com/golang-jwt/jwt"
	"test-api/app/config"
	"test-api/app/models"
	"time"
)

func GenerateToken(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"id":    user.ID,
		"login": user.Login,
		"exp":   time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(config.Current.JwtSecret))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func VerifyToken(token string) (uint, error) {
	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.Current.JwtSecret), nil
	})
	if err != nil {
		return 0, err
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok {
		return 0, errors.New("ошибка при парсинге токена")
	}

	id := claims["id"].(float64)

	return uint(id), nil
}

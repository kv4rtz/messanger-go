package middlewares

import (
	"github.com/gofiber/fiber/v2"
	"net/http"
	"strings"
	"test-api/app/models"
	"test-api/utils"
)

func WebsocketAuth(c *fiber.Ctx) error {
	authHeader := c.Query("authorization")

	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		tokenString := strings.Split(authHeader, " ")[1]

		userId, err := utils.VerifyToken(tokenString)
		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(utils.ResponseMessage{Message: err.Error()})
		}

		var userService = models.User{}
		user, err2 := userService.GetUserById(userId)
		if err2 != nil {
			return c.Status(http.StatusUnauthorized).JSON(utils.ResponseMessage{Message: "Авторизация не прошла"})
		}

		c.Locals("user", user)

		return c.Next()
	}
	return c.Status(http.StatusUnauthorized).JSON(utils.ResponseMessage{Message: "Авторизация не прошла"})
}

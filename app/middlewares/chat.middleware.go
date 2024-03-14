package middlewares

import (
	"github.com/gofiber/fiber/v2"
	"net/http"
	"test-api/app/models"
	"test-api/utils"
)

func Chat(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	user := c.Locals("user").(models.User)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(utils.ResponseMessage{Message: "Не удалось получить верные параметры"})
	}

	chatService := models.Chat{}
	chat, err2 := chatService.GetChatById(uint(id))
	if err2 != nil {
		return c.Status(http.StatusNotFound).JSON(utils.ResponseMessage{Message: "Нет такого чата"})
	}

	access := false
	for _, element := range chat.Users {
		if element.ID == user.ID {
			access = true
		}
	}

	if !access {
		return c.Status(http.StatusForbidden).JSON(utils.ResponseMessage{Message: "Вы не не состоите в чате"})
	}

	c.Locals("chat", chat)
	return c.Next()
}

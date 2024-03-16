package controllers

import (
	"github.com/gofiber/fiber/v2"
	"net/http"
	"test-api/app/models"
	"test-api/utils"
)

var chatsService = models.Chat{}

func GetChats(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	chats, err := chatsService.GetAllChatsChat(user)

	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(utils.ResponseMessage{Message: err.Error()})
	}

	return c.Status(http.StatusOK).JSON(chats)
}

func GetChatById(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(utils.ResponseMessage{Message: err.Error()})
	}

	chat, err1 := chatsService.GetChatById(uint(id))

	if err1 != nil {
		return c.Status(http.StatusBadRequest).JSON(utils.ResponseMessage{Message: err.Error()})
	}

	return c.Status(http.StatusOK).JSON(chat)
}

func CreateChat(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(utils.ResponseMessage{Message: "Не удалось получить верные параметры"})
	}
	if uint(id) == user.ID {
		return c.Status(http.StatusBadRequest).JSON(utils.ResponseMessage{Message: "Нельзя создать чат с самим собой"})
	}
	user2, err2 := userService.GetUserById(uint(id))
	if err2 != nil {
		return c.Status(http.StatusNotFound).JSON(utils.ResponseMessage{Message: "Пользователь не найден"})
	}

	var body struct {
		Name string `json:"name"`
	}
	if err := c.BodyParser(&body); err != nil || body.Name == "" {
		return c.Status(http.StatusBadRequest).JSON(utils.ResponseMessage{Message: "Введите название чата"})
	}

	if err := chatsService.CreateChat(user, user2, body.Name); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.ResponseMessage{Message: err.Error()})
	}

	return c.Status(http.StatusCreated).JSON(utils.ResponseMessage{Message: "Чат создан"})
}

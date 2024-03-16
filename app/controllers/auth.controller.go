package controllers

import (
	"github.com/gofiber/fiber/v2"
	"net/http"
	"test-api/app/models"
	"test-api/utils"
)

func Login(c *fiber.Ctx) error {
	var bodyUser models.User
	if err := c.BodyParser(&bodyUser); err != nil {
		return c.Status(http.StatusBadRequest).JSON(utils.ResponseMessage{Message: "Ошибка при парсинге данных"})
	}

	user, err := userService.GetUserByLogin(bodyUser.Login)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(utils.ResponseMessage{Message: "Пользователь с таким логином не найден"})
	}

	if user.Password != bodyUser.Password {
		return c.Status(http.StatusBadRequest).JSON(utils.ResponseMessage{Message: "Логин или пароль не верны"})
	}

	token, err2 := utils.GenerateToken(user)
	if err2 != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.ResponseMessage{Message: "Ошибка при генерации токена"})
	}

	return c.Status(http.StatusOK).JSON(map[string]string{
		"token": token,
	})
}

func Register(c *fiber.Ctx) error {
	var bodyUser models.User
	if err := c.BodyParser(&bodyUser); err != nil {
		return c.Status(http.StatusBadRequest).JSON(utils.ResponseMessage{Message: "Ошибка при парсинге данных"})
	}
	file, err := c.FormFile("avatar")
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(utils.ResponseMessage{Message: "Ошибка при парсинге данных"})
	}
	destination := utils.GenerateDestinationFile(file, "avatars")
	bodyUser.Avatar = destination[2:]
	if err := c.SaveFile(file, destination); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.ResponseMessage{Message: "Ошибка при сохранении файла"})
	}
	foundUser, err1 := userService.CreateUser(bodyUser)
	if err1 != nil {
		return c.Status(http.StatusBadRequest).JSON(utils.ResponseMessage{Message: err1.Error()})
	}

	token, err2 := utils.GenerateToken(foundUser)
	if err2 != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.ResponseMessage{Message: "Ошибка при генерации токена"})
	}

	return c.Status(http.StatusOK).JSON(map[string]string{
		"token": token,
	})
}

func CheckToken(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	return c.Status(http.StatusOK).JSON(user)
}

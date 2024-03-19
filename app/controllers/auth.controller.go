package controllers

import (
	"github.com/gofiber/fiber/v2"
	"net/http"
	"test-api/app/models"
	_ "test-api/docs"
	"test-api/utils"
)

type ResponseToken struct {
	Token string `json:"token"`
}

// Login godoc
//
//	@Summary		Login
//	@Description	Login
//	@Tags			Authentication
//	@Accept			json
//	@Produce		json
//	@Param			login		body		string	true	"Login"
//	@Param			password	body		string	true	"Password"
//	@Success		200			{object}	ResponseToken
//	@Router			/auth/login [post]
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

// Register godoc
//
//	@Summary		Register
//	@Description	Register new account
//	@Tags			Authentication
//	@Accept			json
//	@Produce		json
//	@Param			login		body		string	true	"Login"
//	@Param			password	body		string	true	"Login"
//	@Param			avatar		formData	file	true	"Avatar"
//	@Success		200			{object}	ResponseToken
//	@Router			/auth/register [post]
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

// CheckToken godoc
//
//	@Summary		Check authorization token
//	@Description	Check Authorization Token
//	@Tags			Authentication
//	@Accept			json
//	@Produce		json
//
//	@Param			Authorization	header		string	true	"Authorization"	example:	"Bearer <KEY>"
//
//	@Success		200				{object}	models.User
//	@Router			/auth/check [get]
func CheckToken(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	return c.Status(http.StatusOK).JSON(user)
}

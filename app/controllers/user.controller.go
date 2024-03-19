package controllers

import (
	"github.com/gofiber/fiber/v2"
	"net/http"
	"test-api/app/models"
	"test-api/utils"
)

var userService = &models.User{}

// GetAllUsers godoc
//
//	@Summary		Get all users
//	@Description	Get all users
//	@Tags			Users
//	@Accept			json
//	@Produce		json
//
//	@Param			Authorization	header		string	true	"Authorization"	example:	"Bearer <KEY>"
//
//	@Success		200				{object}	[]models.User
//	@Router			/users [get]
func GetAllUsers(c *fiber.Ctx) error {
	users, err := userService.GetAllUsers()
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(utils.ResponseMessage{Message: err.Error()})
	}

	return c.Status(http.StatusOK).JSON(users)
}

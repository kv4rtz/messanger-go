package router

import (
	"github.com/gofiber/fiber/v2"
	"test-api/app/controllers"
	"test-api/app/middlewares"
)

func UserRouter(r fiber.Router) {
	userRouter := r.Group("/users")

	userRouter.Get("/", middlewares.Auth, controllers.GetAllUsers)
}

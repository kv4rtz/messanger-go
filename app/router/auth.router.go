package router

import (
	"github.com/gofiber/fiber/v2"
	"test-api/app/controllers"
)

func AuthRouter(r fiber.Router) {
	authRouter := r.Group("/auth")

	authRouter.Post("/login", controllers.Login)
	authRouter.Post("/register", controllers.Register)
}

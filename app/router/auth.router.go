package router

import (
	"github.com/gofiber/fiber/v2"
	"test-api/app/controllers"
	"test-api/app/middlewares"
)

func AuthRouter(r fiber.Router) {
	authRouter := r.Group("/auth")

	authRouter.Post("/login", controllers.Login)
	authRouter.Post("/register", controllers.Register)
	authRouter.Get("/check", middlewares.Auth, controllers.CheckToken)
}

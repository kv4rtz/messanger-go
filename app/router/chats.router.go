package router

import (
	"github.com/gofiber/fiber/v2"
	"test-api/app/controllers"
	"test-api/app/middlewares"
)

func ChatRouter(r fiber.Router) {
	chatRouter := r.Group("/chats")
	chatRouter.Use(middlewares.Auth)
	chatRouter.Get("/", controllers.GetChats)
	chatRouter.Get("/:id", controllers.GetChatById)
	chatRouter.Post("/:id", controllers.CreateChat)
}

package main

import (
	"github.com/gofiber/fiber/v2"
	"test-api/app/config"
	"test-api/app/models"
	"test-api/app/router"
)

func main() {
	config.MustConfig()

	app := fiber.New()
	models.ConnectDB()
	models.MigrateDB()

	r := app.Group("/")
	router.AuthRouter(r)
	router.UserRouter(r)
	router.WebSocketsRouter(r)
	router.ChatRouter(r)

	if err := app.Listen(config.Current.Port); err != nil {
		return
	}
}

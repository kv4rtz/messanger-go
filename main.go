package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"test-api/app/config"
	"test-api/app/models"
	"test-api/app/router"
)

func main() {
	config.MustConfig()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "*",
	}))
	models.ConnectDB()
	models.MigrateDB()

	r := app.Group("/")
	router.AuthRouter(r)
	router.UserRouter(r)
	router.WebSocketsRouter(r)
	router.ChatRouter(r)

	r.Static("/public", "./public")
	if err := app.Listen("192.168.1.16" + config.Current.Port); err != nil {
		return
	}
}

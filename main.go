package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	fiberSwagger "github.com/swaggo/fiber-swagger"
	"test-api/app/config"
	"test-api/app/models"
	"test-api/app/router"
	_ "test-api/docs"
)

// Main function godoc
// @title			Messenger API Documentation test
// @version		1.0
// @description	Документация для Messenger REST API
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
	r.Get("/swagger/*", fiberSwagger.WrapHandler)
	router.AuthRouter(r)
	router.UserRouter(r)
	router.WebSocketsRouter(r)
	router.ChatRouter(r)

	r.Static("/public", "./public")
	if err := app.Listen(config.Current.Port); err != nil {
		return
	}
}

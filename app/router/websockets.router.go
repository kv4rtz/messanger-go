package router

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"test-api/app/gateways"
	"test-api/app/middlewares"
)

func WebSocketsRouter(r fiber.Router) {
	webSocketsRouter := r.Group("/ws")

	go gateways.RunHub()
	webSocketsRouter.Use(middlewares.WebsocketMiddleware)
	webSocketsRouter.Use(middlewares.WebsocketAuth)
	webSocketsRouter.Get("/:id", middlewares.Chat, websocket.New(gateways.WebsocketChat))
}

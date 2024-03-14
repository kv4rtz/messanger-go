package middlewares

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"test-api/utils"
)

func WebsocketMiddleware(ctx *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(ctx) {
		return ctx.Next()
	}
	return ctx.Status(http.StatusUpgradeRequired).JSON(utils.ResponseMessage{Message: "Требуется подключиться через WebSockets"})
}

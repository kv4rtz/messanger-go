package gateways

import (
	"encoding/json"
	"github.com/gofiber/contrib/websocket"
	"log"
	"test-api/app/models"
)

type WebsocketMessage struct {
	Event   string         `json:"event"`
	Data    string         `json:"data"`
	Message models.Message `json:"message"`
}

type client models.User

var clients = make(map[*websocket.Conn]client)
var register = make(chan *websocket.Conn)
var broadcast = make(chan WebsocketMessage)
var unregister = make(chan *websocket.Conn)

var messageService = models.Message{}

func RunHub() {
	for {
		select {
		case conn := <-register:
			clients[conn] = client{}

		case message := <-broadcast:
			response, err := json.Marshal(message)
			if err != nil {
				return
			}
			for conn := range clients {
				if message.Event == "message" {
					if err := conn.WriteMessage(websocket.TextMessage, response); err != nil {
						log.Println(err)
						unregister <- conn
						if err := conn.Close(); err != nil {
							return
						}
					}
				}
			}
		case conn := <-unregister:
			delete(clients, conn)
		}
	}
}

func WebsocketChat(ws *websocket.Conn) {
	defer func(ws *websocket.Conn) {
		if err := ws.Close(); err != nil {
			log.Println(err)
		}

		unregister <- ws
	}(ws)

	register <- ws
	user := ws.Locals("user").(models.User)
	chat := ws.Locals("chat").(models.Chat)

	messages, err := messageService.GetMessagesByChatId(chat.ID)
	if err != nil {
		return
	}

	for _, message := range messages {
		response, err1 := json.Marshal(WebsocketMessage{
			Event:   "message",
			Message: message,
		})
		if err1 != nil {
			return
		}

		err := ws.WriteMessage(websocket.TextMessage, response)
		if err != nil {
			return
		}
	}

	for {
		_, message, err := ws.ReadMessage()
		if err != nil {
			log.Println(err)
			break
		}

		createdMessage, err1 := messageService.CreateMessage(string(message), user.ID, chat.ID)
		if err1 != nil {
			return
		}
		createdMessage.User = &user

		broadcast <- WebsocketMessage{Message: createdMessage, Event: "message"}
	}
}

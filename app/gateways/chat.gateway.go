package gateways

import (
	"github.com/gofiber/contrib/websocket"
	"log"
	"test-api/app/models"
)

type client models.User

var clients = make(map[*websocket.Conn]client)
var register = make(chan *websocket.Conn)
var broadcast = make(chan string)
var unregister = make(chan *websocket.Conn)

var messageService = models.Message{}

func RunHub() {
	for {
		select {
		case conn := <-register:
			clients[conn] = client{}

		case message := <-broadcast:
			for conn := range clients {
				if err := conn.WriteMessage(websocket.TextMessage, []byte(message)); err != nil {
					log.Println(err)
					unregister <- conn
					if err := conn.Close(); err != nil {
						return
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
		err := ws.WriteMessage(websocket.TextMessage, []byte(message.User.Login+": "+message.Text))
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

		if err := messageService.CreateMessage(string(message), user.ID, chat.ID); err != nil {
			return
		}

		broadcast <- user.Login + ": " + string(message)
	}
}

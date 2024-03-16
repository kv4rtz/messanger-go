package models

import (
	"gorm.io/gorm/clause"
	"time"
)

type Message struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	Text      string    `json:"text"`
	UserID    uint      `json:"userId"`
	ChatID    uint      `json:"chatId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	User      *User     `json:"user"`
}

func (c *Message) CreateMessage(text string, userId, chatId uint) (Message, error) {
	var message = Message{Text: text, UserID: userId, ChatID: chatId}
	if err := Database.Preload(clause.Associations).Create(&message).Error; err != nil {
		return message, err
	}

	return message, nil
}

func (c *Message) GetMessagesByChatId(chatId uint) ([]Message, error) {
	var messages []Message
	if err := Database.Preload(clause.Associations).Where("chat_id =?", chatId).Find(&messages).Error; err != nil {
		return messages, err
	}

	return messages, nil
}

package models

import (
	"errors"
	"time"
)

type Chat struct {
	ID        uint      `json:"id" gorm:"primary_key;"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Users     []User    `json:"users" gorm:"many2many:user_chats;"`
	Messages  []Message `json:"messages"`
}

func (c *Chat) CreateChat(user, user2 User, name string) error {
	if err := Database.Create(&Chat{Name: name, Users: []User{user, user2}}); err.Error != nil {
		return err.Error
	} else if err.RowsAffected == 0 {
		return errors.New("чат уже существует")
	}

	return nil
}

func (c *Chat) GetAllChatsChat(user User) ([]Chat, error) {
	var chats []Chat

	if err := Database.Preload("Users").Where("id IN (?)", Database.Table("user_chats").Select("chat_id").Where("user_id = ?", user.ID)).Find(&chats).Error; err != nil {
		return chats, err
	}

	return chats, nil
}

func (c *Chat) GetChatById(id uint) (Chat, error) {
	var chat Chat
	if err := Database.Where("id = ?", id).Preload("Users").First(&chat).Error; err != nil {
		return chat, err
	}

	return chat, nil
}

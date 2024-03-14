package models

import (
	"errors"
	"time"
)

type User struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	Login     string    `json:"login" gorm:"unique"`
	Password  string    `json:"password"`
	Avatar    string    `json:"avatar"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Chats     []Chat    `json:"chats" gorm:"many2many:user_chats;"`
	Messages  []Message `json:"messages"`
}

func (u *User) CreateUser(user User) (User, error) {
	result := Database.Where("login = ?", user.Login).FirstOrCreate(&user)

	if result.RowsAffected == 0 {
		return user, errors.New("пользователь уже существует")
	} else if result.Error != nil {
		return user, result.Error
	}

	return user, nil
}

func (u *User) GetAllUsers() ([]User, error) {
	var users []User
	if err := Database.Find(&users).Error; err != nil {
		return users, err
	}

	return users, nil
}

func (u *User) GetUserById(id uint) (User, error) {
	var user User
	if err := Database.Where("id =?", id).First(&user).Error; err != nil {
		return user, err
	}
	return user, nil
}

func (u *User) GetUserByLogin(login string) (User, error) {
	var user User
	if err := Database.Where("login = ?", login).First(&user).Error; err != nil {
		return user, err
	}
	return user, nil
}

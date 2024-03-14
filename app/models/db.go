package models

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"test-api/app/config"
)

var Database *gorm.DB

func ConnectDB() {
	var (
		host     = config.Current.DatabaseConfig.Host
		port     = config.Current.DatabaseConfig.Port
		user     = config.Current.DatabaseConfig.User
		password = config.Current.DatabaseConfig.Password
		dbname   = config.Current.DatabaseConfig.Dbname
	)

	database, err := gorm.Open(postgres.Open(fmt.Sprintf("host=%v port=%v user=%v password=%v dbname=%v sslmode=disable", host, port, user, password, dbname)))
	if err != nil {
		log.Fatal(err)
	}

	Database = database
}

func MigrateDB() {
	if err := Database.AutoMigrate(&User{}, &Chat{}, &Message{}); err != nil {
		return
	}
}

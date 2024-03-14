package config

import (
	"encoding/json"
	"log"
	"os"
)

type Config struct {
	Port           string         `json:"port"`
	JwtSecret      string         `json:"jwtSecret"`
	DatabaseConfig DatabaseConfig `json:"databaseConfig"`
}

type DatabaseConfig struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
	Dbname   string `json:"dbname"`
}

var Current = new(Config)

func MustConfig() {
	cfg, err := os.ReadFile("./app/config/config.json")
	if err != nil {
		log.Fatal(err)
	}

	if err = json.Unmarshal(cfg, Current); err != nil {
		log.Fatal(err)
	}
}

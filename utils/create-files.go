package utils

import (
	"fmt"
	"github.com/google/uuid"
	"mime/multipart"
	"path/filepath"
)

func GenerateDestinationFile(file *multipart.FileHeader, directory string) string {
	uniqueId := uuid.New().String()
	label := uniqueId + filepath.Ext(file.Filename)
	destination := fmt.Sprintf("./public/%s/%s", directory, label)

	return destination
}

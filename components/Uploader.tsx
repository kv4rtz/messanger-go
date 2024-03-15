import { Button, Avatar } from '@nextui-org/react'
import { Dispatch, SetStateAction, useRef, useState, DragEvent } from 'react'

interface FileObject {
  current: File
  preview: string
}

interface UploaderProps {
  title: string
  setFileProps: Dispatch<SetStateAction<File | null>>
}

export const Uploader = ({ title, setFileProps }: UploaderProps) => {
  const inputUploader = useRef<HTMLInputElement>(null)
  const upload = () => {
    if (inputUploader.current) {
      inputUploader.current.click()
    }
  }
  const [file, setFile] = useState<FileObject | null>(null)
  const handleInputUploader = () => {
    if (inputUploader.current) {
      if (inputUploader.current.files) {
        const file = inputUploader.current.files[0]
        if (file) {
          const url = URL.createObjectURL(file)
          setFile({ current: file, preview: url })
          setFileProps(file)
        }
      }
    }
  }
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    const url = URL.createObjectURL(file)

    setFile({ current: file, preview: url })
    setFileProps(file)
  }
  return (
    <label
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="py-2 px-3 bg-default-100 rounded-medium cursor-pointer"
    >
      <p className="text-foreground-500 text-small">{title}</p>
      <div className="flex gap-3 items-center mt-2">
        <Button onClick={upload}>Загрузить</Button>
        {file ? (
          <>
            <Avatar src={file.preview} />
            <p className="text-small text-foreground-500">
              {file.current.name}
            </p>
          </>
        ) : (
          <p className="text-small text-foreground-500">
            Или перетащите файл сюда
          </p>
        )}
      </div>
      <input
        onChange={handleInputUploader}
        ref={inputUploader}
        className="hidden"
        type="file"
      />
    </label>
  )
}

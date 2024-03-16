export const useTime = (date: string) => {
  return new Date(date).toLocaleTimeString('ru-RU').slice(0, -3)
}

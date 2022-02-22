export function convertDuration(v: number) {
  const hours = Math.floor(v / 3600)
  const minutes = Math.floor((v % 3600) / 60)
  const seconds = v % 60

  return [hours, minutes, seconds].map(unit => String(unit).padStart(2, '0')).join(':')
}

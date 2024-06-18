const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  const year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

export const areBothDatesFromToday = (date: Date | string) => {
  const today = formatDate(new Date())
  const givenDate = formatDate(date)
  return today === givenDate
}

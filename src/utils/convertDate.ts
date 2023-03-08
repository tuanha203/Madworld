import moment from 'moment'

export const convertUnixTimeToDateTime = (time: any) => {
  return moment.unix(time).format('hh:mm:ss A MM/DD/yyyy')
}

export const convertTimeToDateTime = (time: any) => {
  return moment(time).format('HH:mm, MM/DD/yyyy')
}

export const convertUnixTimeToTime = (time: any) => {
  return moment.unix(time).format('hh:mm:ss')
}

export const convertDateTimeToUnix = (time: any) => {
  if (!time) {
    return ''
  }

  const unixTime = moment(time).format('x')
  return moment(time)
    .format('x')
    .substring(0, unixTime.length - 3)
}

export const getDiffTime = (startDate: any, endDate: any) => {
  const SECOND_PER_DAY = 86400
  const diffInSecond = moment(endDate).diff(startDate, 'seconds')
  const diffInDay = diffInSecond / SECOND_PER_DAY
  return diffInDay
}

export const getDiffUnixTime = (startDate: any, endDate: any) => {
  const diffInSecond = moment.duration(moment.unix(startDate).diff(moment.unix(endDate))).asSeconds()

  let days = Math.floor(diffInSecond / (3600 * 24))

  let hours = Math.floor((diffInSecond % (60 * 60 * 24)) / (60 * 60))

  let minutes = Math.floor((diffInSecond % (60 * 60)) / 60)

  let seconds = Math.floor(diffInSecond % 60)

  if (days < 10) {
    days = ('0' + days) as any
  }

  if (hours < 10) {
    hours = ('0' + hours) as any
  }

  if (minutes < 10) {
    minutes = ('0' + minutes) as any
  }
  if (seconds < 10) {
    seconds = ('0' + seconds) as any
  }

  const timeLeft = [days, hours, minutes, seconds]

  return timeLeft
}

export const getCustomDiffTime = (startTime: any) => {
  if (!startTime) return
  const duration = moment.duration(moment().diff(startTime))
  const diffInDays = duration.asDays()
  const diffInHours = duration.asHours()
  const diffInMinutes = duration.asMinutes()
  const diffInSeconds = duration.asSeconds()

  if (diffInSeconds <= 60) return `${Math.round(diffInSeconds)} second${Math.round(diffInSeconds) > 1 ? 's' : ''} ago`
  if (diffInMinutes <= 60) return `${Math.round(diffInMinutes)} minute${Math.round(diffInMinutes) > 1 ? 's' : ''} ago`
  if (diffInHours <= 24) return `${Math.round(diffInHours)} hour${Math.round(diffInHours) > 1 ? 's' : ''} ago`
  return `${Math.round(diffInDays)} day${Math.round(diffInDays) > 1 ? 's' : ''} ago`
}

export const getCustomeTimeLeft = (till: any) => {
  if (!till) return
  const duration = till - moment().unix()
  if (duration <= 86400) return `in 1 day`
  return `in ${Math.ceil(duration / 86400)} days`
}

export const addZero = (number: number) => {
  return number < 10 ? `0${number}` : number
}

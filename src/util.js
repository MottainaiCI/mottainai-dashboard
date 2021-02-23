import dayjs from "@/day"

const newline = "\n"
export const nl2br = (text) => {
  if (typeof text === "number") {
    return text
  } else if (typeof text !== "string") {
    return ""
  }

  let lines = text.split(newline)
  return lines.map((line, i) => {
    return (
      <span key={i}>
        {line}
        <br />
      </span>
    )
  })
}

export const datetimeFormatStr = "YYYY/MM/DD hh:mm:ss a"
export const durationFormatFn = (startTime, endTime) => {
  let djsEndTime = endTime ? dayjs(endTime) : dayjs()
  let djsDuration = dayjs.duration(djsEndTime.diff(startTime))
  let durationStr = ""
  if (djsDuration.seconds() || djsDuration.hours() || djsDuration.minutes()) {
    durationStr = ` ${djsDuration.seconds()}s`
  }
  if (djsDuration.minutes() || djsDuration.hours()) {
    durationStr = ` ${djsDuration.minutes()}m ${durationStr}`
  }
  if (djsDuration.hours()) {
    durationStr = ` ${djsDuration.hours()}h ${durationStr}`
  }
  return durationStr
}

export const relativeTimeFormatFn = (val) =>
  val ? dayjs().to(dayjs(val)) : "N/A"
export const dateFormatFn = (val) =>
  val ? dayjs(val).format(datetimeFormatStr) : "N/A"

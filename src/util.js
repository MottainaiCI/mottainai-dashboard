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

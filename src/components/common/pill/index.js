import ThemeContext from "@/contexts/theme"

import themes from "@/themes"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"
import { Link } from "preact-router"
import { useContext } from "preact/hooks"

// todo: let props override theme
const Pill = ({ children, className, ...props }) => {
  let { theme } = useContext(ThemeContext)
  return (
    <div
      className={`text-sm rounded-xl px-3 py-1 mr-1 w-max select-text
        ${themes[theme].pill} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const PillLink = ({
  LinkTag = Link,
  children,
  href,
  target,
  icon,
  ...props
}) => {
  const pillIcon = icon || "external-link-alt"
  return (
    <LinkTag href={href} target={target} rel={target && "noreferrer"}>
      <Pill {...props}>
        {children}
        <FontAwesomeIcon icon={pillIcon} className="ml-1" />
      </Pill>
    </LinkTag>
  )
}

export default Pill

import ThemeContext from "@/contexts/theme"

import themes from "@/themes"
import { useContext } from "preact/hooks"

// todo: let props override theme
const Button = ({ children, className, ...props }) => {
  let { theme } = useContext(ThemeContext)
  return (
    <button
      className={`
        px-2 py-1 w-max focus:outline-none 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${themes[theme].button} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

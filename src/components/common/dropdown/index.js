import { useContext } from "preact/hooks"
import ThemeContext from "@/contexts/theme"
import themes from "@/themes"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"

const Dropdown = ({ label, anchor = "left-0", options, actionArgs = [] }) => {
  let { theme } = useContext(ThemeContext)
  const optionEl = options.map(({ label, onClick }, i) => (
    <div
      key={i}
      className={`py-2 px-4 block whitespace-no-wrap
          ${themes[theme].dropdown.element}`}
      onClick={() => onClick(...actionArgs)}
    >
      {label}
    </div>
  ))
  return (
    <div className="group relative cursor-pointer w-max">
      <div className="flex items-center">
        {label}
        {typeof label === "string" && (
          <FontAwesomeIcon icon="caret-down" className="p-1 ml-3" />
        )}
      </div>
      <div className={`absolute w-max hidden group-hover:block z-20 ${anchor}`}>
        {optionEl}
      </div>
    </div>
  )
}

export default Dropdown

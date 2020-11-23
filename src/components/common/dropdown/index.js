import { useContext } from "preact/hooks"
import ThemeContext from "@/contexts/theme"
import themes from "@/themes"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"

const Dropdown = ({ label, options, actionArgs = [] }) => {
  let { theme } = useContext(ThemeContext)
  const optionEl = options.map(({ label, onClick }) => (
    <li>
      <a
        className={`py-2 px-4 block whitespace-no-wrap
          ${themes[theme].dropdown.element}`}
        href="#"
        onClick={() => onClick(...actionArgs)}
      >
        {label}
      </a>
    </li>
  ))
  return (
    <div className="group relative cursor-pointer w-max">
      <div className="flex items-center p-1">
        {label}
        <FontAwesomeIcon icon="caret-down" className="ml-3" />
      </div>
      <ul className="absolute w-max hidden group-hover:block z-10">
        {optionEl}
      </ul>
    </div>
  )
}

export default Dropdown

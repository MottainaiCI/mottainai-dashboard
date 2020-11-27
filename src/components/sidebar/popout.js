import { SidebarItem } from "./common"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"
import { useContext } from "preact/hooks"
import ThemeContext from "@/contexts/theme"
import SidebarContext from "@/contexts/sidebar"
import themes from "@/themes"
import { Link } from "preact-router/match"

export const SidebarPopoutMenu = ({
  anchor = "top",
  label,
  icon,
  children,
}) => {
  let { theme } = useContext(ThemeContext)
  let { collapsed } = useContext(SidebarContext)
  return (
    <SidebarItem
      icon={icon}
      className={`cursor-pointer group relative hover:${themes[theme].sidebar.activeBg}`}
    >
      {!collapsed && (
        <div className="flex justify-between items-center">
          <div className="flex-none">{label}</div>
          <div className="flex-none">
            <FontAwesomeIcon icon="caret-right" className="mr-3" />
          </div>
        </div>
      )}
      <div
        className={`absolute ${anchor}-0 left-full w-max hidden group-hover:block
          ${themes[theme].sidebar.bg}`}
      >
        {children}
      </div>
    </SidebarItem>
  )
}

export const SidebarPopoutSelector = ({
  options,
  selected,
  onSelect = () => {},
  ...props
}) => {
  let { theme } = useContext(ThemeContext)
  return (
    <SidebarPopoutMenu {...props}>
      {options.map(({ label, value }) => (
        <div
          className={`py-2 px-4 block whitespace-no-wrap h-10
          ${
            value === selected
              ? themes[theme].popout.selected
              : themes[theme].popout.notSelected
          }`}
          onClick={() => onSelect(value)}
        >
          {label}
        </div>
      ))}
    </SidebarPopoutMenu>
  )
}

export const SidebarPopoutItem = ({ Tag = "div", icon, text, ...props }) => {
  // use `class` since `activeClassName` could be passed in
  return (
    <Tag class="py-2 px-4 h-10 flex items-center" {...props}>
      {icon && (
        <div className="flex-none w-8 inline-block text-center">
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      <div className="flex-1 ml-2 text-lg">{text}</div>
    </Tag>
  )
}

export const SidebarPopoutLink = (props) => {
  let { theme } = useContext(ThemeContext)
  return (
    <SidebarPopoutItem
      Tag={Link}
      activeClassName={themes[theme].sidebar.activeBg}
      {...props}
    />
  )
}

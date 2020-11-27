import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"
import { Link } from "preact-router/match"
import { useContext } from "preact/hooks"
import ThemeContext from "@/contexts/theme"
import themes from "@/themes"
import SidebarContext from "@/contexts/sidebar"

const SidebarItem = ({ icon, text, children, className = "", ...props }) => {
  let { collapsed } = useContext(SidebarContext)
  return (
    <div className={`py-2 pl-4 h-10 flex items-center ${className}`} {...props}>
      <div className="flex-none w-8 inline-block text-center">
        {icon && <FontAwesomeIcon icon={icon} />}
      </div>
      {text ? (
        !collapsed && <div className="flex-1 ml-2 text-lg">{text}</div>
      ) : (
        <div className="flex-1 ml-2 text-lg">{children}</div>
      )}
    </div>
  )
}

const SidebarLink = ({ icon, text, ...props }) => {
  let { theme } = useContext(ThemeContext)
  let { collapsed } = useContext(SidebarContext)
  return (
    <Link
      class="py-2 pl-4 h-10 flex items-center"
      activeClassName={themes[theme].sidebar.activeBg}
      {...props}
    >
      <div className="flex-none w-8 inline-block text-center">
        <FontAwesomeIcon icon={icon} />
      </div>
      {!collapsed && <div className="flex-1 ml-2 text-lg">{text}</div>}
    </Link>
  )
}

export { SidebarItem, SidebarLink }

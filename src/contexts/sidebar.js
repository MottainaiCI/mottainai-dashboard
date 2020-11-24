import { createContext } from "preact"

const SidebarContext = createContext({
  collapsed: false,
  setCollapsed() {},
})

export default SidebarContext

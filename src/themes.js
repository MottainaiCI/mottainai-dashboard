export default {
  "mott-light": {
    bg: "bg-cultured-white",
    textColor: "text-cultured-black",
    spinnerFrontColor: "#000",
    cardContainer: "bg-white border border-gray-200",
    dashboard: {
      cardTitleBorder: "border-b border-gray-200",
    },
    consoleWrapper: {
      container: "m-0 bg-black text-green-terminal font-mono text-sm"
    },
    commandWrapper: {
      container: "bg-beige-300",
      line: "pt-3 pb-3 pl-2 pr-2 even:bg-white"
    },
    sidebar: {
      bg: "bg-beige-100",
      activeBg: "bg-beige-300",
    },
    dropdown: {
      element: "bg-beige-200 hover:bg-beige-500 hover:text-cultured-white",
    },
    popout: {
      notSelected: "hover:bg-beige-200 bg-beige-100",
      selected: "bg-beige-300",
    },
    table: {
      root: "table-mott-light",
      thead: "bg-beige-300",
    },
    logs: {
      container: "border",
      bg: "bg-black",
      scrollTrack: "bg-white",
      scrollThumb: "bg-beige-200",
      scrollOnBg: "bg-beige-200",
      scrollOffBg: "bg-beige-100",
    },
    pill: "bg-beige-200",
    button: "bg-beige-200 hover:bg-beige-300 disabled:bg-beige-200",
    select: "bg-beige-200 focus:outline-none",
  },
  "mott-dark": {
    bg: "bg-beige-700",
    textColor: "text-cultured-white",
    spinnerFrontColor: "#fff",
    cardContainer: "bg-beige-750 border-beige-750 border",
    consoleWrapper: {
      container: "m-0 bg-black text-green-terminal font-mono text-sm"
    },
    commandWrapper: {
      container: "bg-beige-300 border-beige-750 border",
      line: "pt-3 pb-3 pl-2 pr-2 even:bg-beige-700"
    },
    dashboard: {
      cardTitleBorder: "border-b border-beige-751",
    },
    sidebar: {
      bg: "bg-beige-500",
      activeBg: "bg-beige-600",
    },
    dropdown: {
      element: "bg-beige-500 hover:bg-beige-600",
    },
    popout: {
      notSelected: "hover:bg-beige-600 bg-beige-500",
      selected: "bg-beige-750 text-white",
    },
    table: {
      root: "table-mott-dark",
      thead: "bg-beige-750",
    },
    logs: {
      container: "",
      bg: "bg-black",
      scrollTrack: "bg-black",
      scrollThumb: "bg-white cursor-pointer",
      scrollOnBg: "bg-beige-700 text-cultured-white",
      scrollOffBg: "bg-beige-500",
    },
    pill: "bg-beige-600",
    button: "bg-beige-600 hover:bg-beige-500 disabled:bg-beige-300",
    select: "bg-beige-600 focus:outline-none",
  },
}

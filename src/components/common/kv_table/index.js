import { useContext } from "preact/hooks"
import startCase from "lodash/startCase"

import themes from "@/themes"
import ThemeContext from "@/contexts/theme"

const KVTable = ({ object, keys, formatters = {}, fieldFormatters = {} }) => {
  let { theme } = useContext(ThemeContext)
  return (
    <table
      role="table"
      className={`w-full select-text px-1 mb-1 ${themes[theme].table.root}`}
    >
      <tbody>
        {keys.map((k, i) => (
          <tr key={i}>
            <td>{fieldFormatters[k] ? fieldFormatters[k](k) : startCase(k)}</td>
            <td>{formatters[k] ? formatters[k](object[k]) : object[k]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default KVTable

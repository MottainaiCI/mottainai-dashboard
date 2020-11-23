import { useTable, usePagination, useGlobalFilter } from "react-table"
import { useContext, useState } from "preact/hooks"
import ThemeContext from "@/contexts/theme"
import themes from "@/themes"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const [value, setValue] = useState(globalFilter)
  const onChange = (value) => {
    setGlobalFilter(value || undefined)
  }

  return (
    <input
      value={value || ""}
      onChange={(e) => {
        setValue(e.target.value)
        onChange(e.target.value)
      }}
      placeholder="Search..."
      className="border border-gray-200 px-2 py-1 text-cultured-black focus:outline-none"
    />
  )
}

const Table = ({ columns, data }) => {
  let { theme } = useContext(ThemeContext)
  const tableInstance = useTable(
    { columns, data },
    useGlobalFilter,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page: rows,
    pageCount,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = tableInstance

  return (
    <>
      <div className="flex flex-row justify-between mb-2">
        <div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
            }}
            className={`px-2 py-1 ${themes[theme].select}`}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>

        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <div className="flex">
          <div
            onClick={previousPage}
            className="cursor-pointer mr-2 text-center w-4"
          >
            <FontAwesomeIcon icon="caret-left" />
          </div>
          <div>
            <span className="font-semibold">{pageIndex + 1}</span> of{" "}
            <span className="font-semibold">{pageCount}</span>
          </div>
          <div
            onClick={nextPage}
            className="cursor-pointer ml-2 text-center w-4"
          >
            <FontAwesomeIcon icon="caret-right" />
          </div>
        </div>
      </div>
      <table
        {...getTableProps()}
        className={`w-full select-text px-1 mb-1 ${themes[theme].table.root}`}
      >
        <thead className={`${themes[theme].table.thead}`}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="px-1 text-left">
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="px-1">
                      {cell.render("Cell")}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div>
        {`Showing ${pageIndex * pageSize + 1} to ${Math.min(
          (pageIndex + 1) * pageSize,
          data.length
        )} of ${data.length}`}
      </div>
    </>
  )
}

export default Table

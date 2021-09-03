import { useTable, usePagination, useSortBy, useFilters } from "react-table"
import { useContext, useEffect, useMemo } from "preact/hooks"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"

import ThemeContext from "@/contexts/theme"
import themes from "@/themes"
import Loader from "@/components/common/loader"

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  let { theme } = useContext(ThemeContext)
  const options = useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach((row) => {
      options.add(row.values[id])
    })
    return Array.from(options)
  }, [id, preFilteredRows])

  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined)
      }}
      className={themes[theme].select}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

const AsyncTable = ({
  columns,
  data,
  total,
  fetchData = () => { },
  pageCount: controlledPageCount = null,
  loading = false,
  defaultSortBy = [{ id: "ID", desc: true }],
}) => {
  let { theme } = useContext(ThemeContext)

  columns.forEach((col) => {
    if (col.filter) {
      col.Filter = SelectColumnFilter
    }
  })

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 20, sortBy: defaultSortBy },
      manualSortBy: true,
      manualPagination: true,
      pageCount: controlledPageCount,
      autoResetPage: false,
      autoResetSortBy: false,
      autoResetFilters: false,
    },
    useFilters,
    useSortBy,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    page: rows,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy },
  } = tableInstance

  useEffect(() => {
    fetchData({ pageIndex, pageSize, sortBy })
  }, [fetchData, pageIndex, pageSize, sortBy])

  if (!loading && !data.length) {
    return <div>No tasks were found.</div>
  }

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
        <div className="flex">
          <div
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="cursor-pointer mr-2 text-center w-4"
          >
            <FontAwesomeIcon icon="caret-left" />
          </div>
          <div>
            <span className="font-semibold">{pageIndex + 1}</span> of{" "}
            <span className="font-semibold">{controlledPageCount}</span>
          </div>
          <div
            onClick={() => nextPage()}
            disabled={!canNextPage}
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
                  <div {...column.getSortByToggleProps()}>
                    {column.render("Header")}
                    {column.isSorted ? (
                      <FontAwesomeIcon
                        className="ml-2"
                        icon={column.isSortedDesc ? "caret-down" : "caret-up"}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  {column.filter && (
                    <div className="py-1">{column.render("Filter")}</div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {!loading && (
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
        )}
      </table>
      {loading && (
        <div className="mx-auto my-5">
          <Loader />
        </div>
      )}
      <div>{`Showing ${Math.min(pageSize, total)} of ${total}`}</div>
    </>
  )
}

export default AsyncTable

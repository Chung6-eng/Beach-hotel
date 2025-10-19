import React, { useState } from "react"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import {DateRangePicker} from "react-date-range"

const DateSlider = ({onDateChange, onFilterChange}) => {
    const[dateRange, setDateRange] = useState({
        startDate: undefined,
        endDate : undefined,
        key:"selection"



    })

    const handleSelect = (ranges) => {
  setDateRange(ranges.selection)
  if (typeof onDateChange === "function") {
    onDateChange(ranges.selection.startDate, ranges.selection.endDate)
  }
  if (typeof onFilterChange === "function") {
    onFilterChange(ranges.selection.startDate, ranges.selection.endDate)
  }
}


   const handleClearFilter = () => {
  setDateRange({
    startDate: undefined,
    endDate: undefined,
    key: "selection"
  })
  if (typeof onDateChange === "function") onDateChange(null, null)
  if (typeof onFilterChange === "function") onFilterChange(null, null)
}


    return (
    <>
      <h5>Filter bookings by date</h5>
        <DateRangePicker ranges={[dateRange]} onChange={handleSelect} className="mb-4"/>
        <button className="btn btn-secondary" onClick={handleClearFilter}></button>
        Clear Filter
    </>
  )
}

export default DateSlider
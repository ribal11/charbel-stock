import { cloneDeep, isEmpty } from "lodash";
import moment from "moment/moment";

export const customTableSearch = (filterText, data, FilterOptions = null) => {
  let searchedValue = filterText.toLowerCase();
  let regExDateFormat = /^[0-9]{2}(\/|-)[0-9]{2}(\/|-)[0-9]{4}/; // start with DD/MM/YYYY or DD-MM-YYYY or MM/DD/YYYY or MM-DD-YYYY
  let regExDateFormat2 = /^[0-9]{4}(\/|-)[0-9]{2}(\/|-)[0-9]{2}/; // start with YYYY/DD/MM or YYYY-DD-MM or YYYY/MM/DD or YYYY-MM-DD
  let dataFiltered = [];



  let includedColumns = !isEmpty(FilterOptions) ?
    FilterOptions.filter(e => e.isSelected).map(e => e.columnName) :
    data.length > 0 ? Object.keys(data[0]) : []


  if (searchedValue) {
    dataFiltered = data.filter(row => {
      let getRow = true;
      if (searchedValue) {

        getRow = false;

        for (let key of includedColumns) {
          let value = row[key]

          if (value && (regExDateFormat.test(value) || regExDateFormat2.test(value) || typeof value.getMonth === "function")) {
            getRow = getRow || moment(value).format("DD/MM/YYYY").includes(searchedValue.trim()) || Moment(value).format("DD-MM-YYYY").includes(searchedValue.trim()) || value.toString().toLowerCase().includes(searchedValue.trim());
          } else if (value) {
            getRow = getRow || value.toString().toLowerCase().includes(searchedValue.trim());
          }
        }

      }

      return getRow

    })
  }
  else {
    dataFiltered = cloneDeep(data)
  }
  return dataFiltered



}

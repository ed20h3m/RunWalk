import moment from "moment";
// convert date format to string
const convertDate = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

export default convertDate;
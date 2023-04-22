import moment from "moment";

const convertDate = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

export default convertDate;

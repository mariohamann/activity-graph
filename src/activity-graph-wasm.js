import ActivityGraphElement from "./activity-graph-element.js";
import dayjs from "dayjs";
import "dayjs/locale/en";
/* locales */
import "dayjs/locale/de";
/* /locales */
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

export default function ActivityGraphWasm({ ...rest }) {
  const toLocaleStringPolyfill = (date, lang, options) => {
    dayjs.locale(lang === "default" ? "en" : lang); // Set the locale for dayjs

    // Map the options to dayjs format tokens
    const formatMap = {
      weekday: {
        long: "dddd",
        short: "ddd",
      },
      month: {
        long: "MMMM",
        short: "MMM",
      },
    };

    let formatString = "";
    if (options.weekday) {
      formatString += formatMap.weekday[options.weekday];
    }
    if (options.month) {
      formatString +=
        (formatString ? " " : "") + formatMap.month[options.month];
    }

    // If no format options are provided, default to a full date format
    if (!formatString) {
      formatString = "YYYY-MM-DD";
    }

    return dayjs(date).format(formatString);
  };

  return ActivityGraphElement({ toLocaleStringPolyfill, ...rest });
}

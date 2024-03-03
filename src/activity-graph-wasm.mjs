import ActivityGraphElement from "./activity-graph-element.mjs";
import dayjs from "dayjs";
import "dayjs/locale/am";
import "dayjs/locale/ar-dz";
import "dayjs/locale/ar-iq";
import "dayjs/locale/ar-kw";
import "dayjs/locale/ar-ly";
import "dayjs/locale/ar-ma";
import "dayjs/locale/ar-sa";
import "dayjs/locale/ar-tn";
import "dayjs/locale/ar";
import "dayjs/locale/az";
import "dayjs/locale/be";
import "dayjs/locale/bg";
import "dayjs/locale/bi";
import "dayjs/locale/bm";
import "dayjs/locale/bn-bd";
import "dayjs/locale/bn";
import "dayjs/locale/bo";
import "dayjs/locale/br";
import "dayjs/locale/bs";
import "dayjs/locale/ca";
import "dayjs/locale/cs";
import "dayjs/locale/cv";
import "dayjs/locale/cy";
import "dayjs/locale/da";
import "dayjs/locale/de-at";
import "dayjs/locale/de-ch";
import "dayjs/locale/de";
import "dayjs/locale/dv";
import "dayjs/locale/el";
import "dayjs/locale/en-au";
import "dayjs/locale/en-ca";
import "dayjs/locale/en-gb";
import "dayjs/locale/en-ie";
import "dayjs/locale/en-il";
import "dayjs/locale/en-in";
import "dayjs/locale/en-nz";
import "dayjs/locale/en-sg";
import "dayjs/locale/en-tt";
import "dayjs/locale/en";
import "dayjs/locale/eo";
import "dayjs/locale/es-do";
import "dayjs/locale/es-mx";
import "dayjs/locale/es-pr";
import "dayjs/locale/es-us";
import "dayjs/locale/es";
import "dayjs/locale/et";
import "dayjs/locale/eu";
import "dayjs/locale/fa";
import "dayjs/locale/fi";
import "dayjs/locale/fo";
import "dayjs/locale/fr-ca";
import "dayjs/locale/fr-ch";
import "dayjs/locale/fr";
import "dayjs/locale/fy";
import "dayjs/locale/ga";
import "dayjs/locale/gd";
import "dayjs/locale/gl";
import "dayjs/locale/gom-latn";
import "dayjs/locale/gu";
import "dayjs/locale/he";
import "dayjs/locale/hi";
import "dayjs/locale/hr";
import "dayjs/locale/ht";
import "dayjs/locale/hu";
import "dayjs/locale/hy-am";
import "dayjs/locale/id";
import "dayjs/locale/is";
import "dayjs/locale/it-ch";
import "dayjs/locale/it";
import "dayjs/locale/ja";
import "dayjs/locale/jv";
import "dayjs/locale/ka";
import "dayjs/locale/kk";
import "dayjs/locale/km";
import "dayjs/locale/kn";
import "dayjs/locale/ko";
import "dayjs/locale/ku";
import "dayjs/locale/ky";
import "dayjs/locale/lb";
import "dayjs/locale/lo";
import "dayjs/locale/lt";
import "dayjs/locale/lv";
import "dayjs/locale/me";
import "dayjs/locale/mi";
import "dayjs/locale/mk";
import "dayjs/locale/ml";
import "dayjs/locale/mn";
import "dayjs/locale/mr";
import "dayjs/locale/ms-my";
import "dayjs/locale/ms";
import "dayjs/locale/mt";
import "dayjs/locale/my";
import "dayjs/locale/nb";
import "dayjs/locale/ne";
import "dayjs/locale/nl-be";
import "dayjs/locale/nl";
import "dayjs/locale/nn";
import "dayjs/locale/oc-lnc";
import "dayjs/locale/pa-in";
import "dayjs/locale/pl";
import "dayjs/locale/pt-br";
import "dayjs/locale/pt";
import "dayjs/locale/rn";
import "dayjs/locale/ro";
import "dayjs/locale/ru";
import "dayjs/locale/rw";
import "dayjs/locale/sd";
import "dayjs/locale/se";
import "dayjs/locale/si";
import "dayjs/locale/sk";
import "dayjs/locale/sl";
import "dayjs/locale/sq";
import "dayjs/locale/sr-cyrl";
import "dayjs/locale/sr";
import "dayjs/locale/ss";
import "dayjs/locale/sv-fi";
import "dayjs/locale/sv";
import "dayjs/locale/sw";
import "dayjs/locale/ta";
import "dayjs/locale/te";
import "dayjs/locale/tet";
import "dayjs/locale/tg";
import "dayjs/locale/th";
import "dayjs/locale/tk";
import "dayjs/locale/tl-ph";
import "dayjs/locale/tlh";
import "dayjs/locale/tr";
import "dayjs/locale/tzl";
import "dayjs/locale/tzm-latn";
import "dayjs/locale/tzm";
import "dayjs/locale/ug-cn";
import "dayjs/locale/uk";
import "dayjs/locale/ur";
import "dayjs/locale/uz-latn";
import "dayjs/locale/uz";
import "dayjs/locale/vi";
import "dayjs/locale/x-pseudo";
import "dayjs/locale/yo";
import "dayjs/locale/zh-cn";
import "dayjs/locale/zh-hk";
import "dayjs/locale/zh-tw";
import "dayjs/locale/zh";
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
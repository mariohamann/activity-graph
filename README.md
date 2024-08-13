# activity-graph

-   [activity-graph](#activity-graph)
    -   [Main Features](#main-features)
    -   [Installation](#installation)
        -   [CDN](#cdn)
        -   [NPM](#npm)
    -   [Usage](#usage)
        -   [Attributes](#attributes)
        -   [Styling](#styling)
            -   [Themes](#themes)
            -   [CSS Variables](#css-variables)
        -   [Rendering](#rendering)
            -   [Progressive Enhancement (Client Side Rendering)](#progressive-enhancement-client-side-rendering)
            -   [Enhance SSR](#enhance-ssr)
            -   [Enhance SSR WASM](#enhance-ssr-wasm)
    -   [Accessibility](#accessibility)

The `<activity-graph>` web component visualizes activity data. It is a simple way to display activity over time, similar to GitHub's contribution graph. It is built with accessibility, flexibility and especially client and server side rendering (SSR) in mind.

-   [GitHub / Docs](https://github.com/mariohamann/activity-graph)
-   [NPM](https://www.npmjs.com/package/@mariohamann/activity-graph)
-   [Demo](https://mariohamann.github.io/activity-graph/)
-   [Blog post](https://mariohamann.com/activity-graph-component/)

## Main Features

-   📦 0 dependencies
-   🎉 flexible usage via attributes
-   🎨 easily stylable via LightDOM and CSS variables
-   🖥️ supports Client and Server Side Rendering

## Installation

### CDN

```html
<script
	type="module"
	src="https://cdn.jsdelivr.net/npm/@mariohamann/activity-graph/dist/activity-graph.min.js"
></script>
```

```html
<activity-graph></activity-graph>
```

### NPM

```bash
npm install @mariohamann/activity-graph
```

```javascript
import "@mariohamann/activity-graph";
```

```html
<activity-graph></activity-graph>
```

## Usage

### Attributes

```html
<activity-graph
	range-start="2021-01-01"
	range-end="2021-12-31"
	activity-data="2021-01-01,2021-01-02,2021-01-03"
	activity-levels="0,1,2,3,5"
	first-day-of-week="1"
	lang="de"
	i18n='{"activities": "Aktivitäten", "less": "Weniger", "more": "Mehr"}'
></activity-graph>
```

-   `range-start` (optional): The start date of the activity graph. Defaults to 1 year ago in client side rendering.
-   `range-end` (optional): The end date of the activity graph. Defaults to today in client side rendering.
-   `activity-data`: The activity data as a comma separated list of dates, e. g. `2021-01-01,2021-01-02,2021-01-03`. By setting dates multiple times the activity level can be increased. See [Progressive Enhancement](#) as an alternative for client side rendering.
-   `activity-levels` (optional): The numbers define the threshold for each level. Defaults to `0,1,2,3,4`. The first number is the lowest level, the last number is the highest level. The number of levels is the length of the list. `0,2,4` would show a graph with three levels, where the second level has a threshold of `2` and the third level has a threshold of `4`
-   `first-day-of-week`: The first day of the week. Defaults to `0` (Sunday). `1` would be Monday, `6` would be Saturday.
-   `lang`: The language of the graph. Defaults to the browser's language. The language is used for date formatting
-   `i18n`: The internationalization of the graph. Defaults to English. The object can contain the keys `activities`, `less` and `more` for the respective labels.

### Styling

The component uses LightDOM and `where()` selectors to be easily stylable.

#### Themes

It supports Light and Dark Mode and uses Light Mode as default. The following classes are available to influence the mode:

-   `.activity-graph-light`: sets the color scheme to light (default)
-   `.activity-graph-dark`: sets the color scheme to dark
-   `.activity-graph-auto`: sets the color scheme to the user's system preference

#### CSS Variables

To theme the graph, you can use the following CSS variables (showing their default values for Light Mode):

```css
activity-graph {
	--activity-graph-text-color: #24292e;
	--activity-graph-level-0-bg: #ebedf0;
	--activity-graph-level-0-border: rgba(27, 31, 35, 0.06);
	--activity-graph-level-1-bg: #9be9a8;
	--activity-graph-level-1-border: rgba(27, 31, 35, 0.06);
	--activity-graph-level-2-bg: #40c463;
	--activity-graph-level-2-border: rgba(27, 31, 35, 0.06);
	--activity-graph-level-3-bg: #30a14e;
	--activity-graph-level-3-border: rgba(27, 31, 35, 0.06);
	--activity-graph-level-4-bg: #216e39;
	--activity-graph-level-4-border: rgba(27, 31, 35, 0.06);
	--activity-graph-disabled-bg: transparent;
	--activity-graph-disabled-border: rgba(27, 31, 35, 0.06);
}
```

> [!TIP]
> Target `activity-graph` or `activity-graph.activity-graph-dark` etc. to easily override styles.

### Rendering

#### Progressive Enhancement (Client Side Rendering)

The web component supports to progressively enhance your content. For that you can "slot" your `activity-data` e. g. in a list. The web component will then take the data from every element's `data-activity` and render the graph instead of the content. This way you can provide a fallback for users with JavaScript disabled.

> [!WARNING]
> This is the preferred implementation for client side rendering and only works there.

```html
<activity-graph>
	<ul>
		<li data-activity="2024-01-03">Activity on 2024-01-03</li>
		<li data-activity="2024-01-04">Activity on 2024-01-04</li>
		<li data-activity="2024-01-05">Activity on 2024-01-05</li>
		<li data-activity="2024-01-06">Activity on 2024-01-06</li>
	</ul>
</activity-graph>
```

#### Enhance SSR

`activity-graph` is provided as a pure function to be used with `@enhance/ssr` for Server Side Rendering. See [Official docs](https://enhance.dev/docs/conventions/elements) or [NPM](https://www.npmjs.com/package/@enhance/ssr) for more information.

> [!TIP]
> There's no client-side JavaScript required.

```js
import ActivityGraph from "@mariohamann/activity-graph/element";
import enhance from "@enhance/ssr";
const html = enhance({
	elements: {
		"activity-graph": ActivityGraph, // Activity Graph expects to be defined with the tag `activity-graph`
	},
});
console.log(html`<activity-graph></activity-graph>`);
```

#### Enhance SSR WASM

`activity-graph` is provided as a pure function to be used with [enhance-ssr-wasm](https://github.com/enhance-dev/enhance-ssr-wasm). This allows you to use the component in "any language that [Extism](https://github.com/extism/extism) has an SDK for including Python, Ruby, .NET, Rust, Go, PHP, Java and more".

> [!TIP]
> There's no client-side JavaScript required.

For implementation details see the examples by the Enhance team:

-   [PHP](https://github.com/enhance-dev/enhance-ssr-php)
-   [Deno](https://github.com/enhance-dev/enhance-ssr-deno)
-   [Java](https://github.com/enhance-dev/enhance-ssr-java)
-   [Python](https://github.com/enhance-dev/enhance-ssr-python)
-   [Ruby](https://github.com/enhance-dev/enhance-ssr-ruby)
-   [Rust](https://github.com/enhance-dev/enhance-ssr-rust)
-   [Go](https://github.com/enhance-dev/enhance-ssr-go)

he JavaScript runtime of Extism's JavaScript PDK (which is used to compile `enhance-ssr-wasm`) doesn't support any locales for Date formatting. To overcome this problem `activity-graph-wasm` bundles [dayjs](https://github.com/iamkun/dayjs) for date formatting. As this extensively raises processing time for SSR, there are different bundles available:

-   `dist/activity-graph-wasm(.min).js`: includes all locales of dayjs – use the most aggressive caching possible!
-   `dist/activity-graph-wasm/en(.min).js`: includes only `en`
-   `dist/activity-graph-wasm/{locale}(.min).js`: includes only {locale} + `en`

> [!CAUTION]
> Make sure to use the smallest appropriate bundle to reduce processing time.

The smallest file is `dist/activity-graph-wasm/en.min.js` and is therefore recommended for testing purposes.

## Accessibility

The component heavily relies on proper semantics, e. g. the usage of `figure`, `figcaption`, `table`, `colspan`, `colgroup` etc. If you have any concerns regarding the implementation, please file an issue.

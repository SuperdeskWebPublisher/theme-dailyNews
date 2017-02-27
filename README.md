DESCRIPTION
-----------

**The Modern Times** theme is fresh, fully responsive, highly adaptible Superdesk Publisher theme built primarily to serve those media operations with high daily news production. It offers editors flexibility in ways they can present sets of news (category or tag based; manually curated, fully- or semi-automated content lists; and more). 

**The Modern Times** also features several customizable menu, html and content list widgets which enable live-site editing from frontend.

In this theme we also showcase how 3rd-party services can be incorporated for reacher user experience (Open weather data integration for any wetaher station in the world, Disqus article comments, Playbuzz voting poll, Google Custom Search Engine).

SETTING UP DEVELOPMENT ENVIRONMENT
----------------------------------

For information and explanation on theme structure, please see http://superdesk-web-publisher.readthedocs.io/en/latest/themes.html 

This Superdesk Publisher theme uses Gulp workflow automation (http://gulpjs.com/). 

To correclty set-up working environment for theme development, you can follow these steps:

- Fork and clone, or just download the theme from GitHub (https://github.com/SuperdeskWebPublisher/theme-dailyNews)
- Make sure Gulp is working on your system (how to get it up and running see here: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
- Gulp file is already there in theme. It has all necessary methods already implemented. For development purposes, you can simply fire the task 'watch' and it will automatically a) compile and add all css/scss/sass changes from `public/css/` to `public/dist/style.css`
b) add all js changes from `public/js/` to `public/dist/all.js` file
- For applying changes for production, there is the task 'build' which will also minify css and js and add specific version to these files (to prevent browser caching issues)
- You can also manually run tasks `sass`, `js`, `cssmin`, `jsmin`, `version`, as well as `sw` (service worker steps that ensure propper pre-caching on browser side)

ADJUSTING AND CUSTOMIZING THEME
-------------------------------
**The Modern Times** theme comes with predefined functionality which includes:
- front page with manually created content list on top of the page and per-category listings under it (these per-category listings and built in several different ways to offer wider base for customization)
- category pages with pagination. Initial category page features one top article.
- article page with featured image on top, article content and article gallery under it (image thumbs that open full version in a fancybox)
- theme also comes with RSS template, static page, search results page and listing of trending articles based on custom criteria (setable in template)
- Theme has built-in support for Google AMP (accelerated mobile pages). These templates are in subfolder `/amp`. More information on Google AMP project is here: https://www.ampproject.org/

For theme templates customization please refer to Superdesk Publisher documentation, starting here: http://superdesk-web-publisher.readthedocs.io/en/latest/templates_system/index.html

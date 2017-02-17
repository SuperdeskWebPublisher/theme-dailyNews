DESCRIPTION
-----------

'The Modern Times' theme is fresh, fully responsive, highly adaptible Superdesk Publisher theme built primarily to serve those media operations with high daily news production. It offers editors flexibility in ways they can present sets of news (category or tag based; manually curated, fully- or semi-automated content lists; and more). 

'The Modern Times' also features several customizable menu, html and content list widgets which enable live-site editing from frontend.

In this theme we also showcase how 3rd-party services can be incorporated for reacher user experience (Open weather data integration for any wetaher station in the world, Disqus article comments, Playbuzz voting poll, Google Custom Search Engine).

DEVELOPMENT
-----------

This Superdesk Publisher theme uses Gulp workflow automation (http://gulpjs.com/). 

To correclty set-up working environment for theme development, you can follow these steps:

- Fork and clone, or just download the theme from GitHub (https://github.com/SuperdeskWebPublisher/theme-dailyNews)
- Make sure Gulp is working on your system (how to get it up and running see here: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
- Gulp file is already there in theme. It has all necessary methods already implemented. For development puproses, you can simply fire the task 'watch' and it will automatically a) compile and add all css/scss/sass changes from public/css/ to public/dist/style.css
b) add all js changes from public/js/ to public/dist/all.js file
- For applying changes for production, there is the task 'build' which will also minify css and js and add specific version to these files (to prvent browser caching issues)
- You can also manually run tasks 'sass', 'js', 'cssmin', 'jsmin', 'version', as well as 'sw' (service worker steps that ensure propper pre-caching on browser side)

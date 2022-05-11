# China Pathfinder

## Exporting files for production

### Change the target container
* In `./src/main.js` change line 5 to `target: document.getElementById('pathfinder-dashboard-container')`

### Export main dashboard
* In `./rollup.config.js` change line 37 to the file path of your local Wordpress installation `file: '../../wordpress/pathfinderlocal/app/public/wp-content/themes/pathfinder-child/dashboard/composite/bundle.js'`
* Run `npm run build`
* Add these lines at the top of the exported file `composite/bundle.js`
    - `var copyPath = data_field.copy_url;`
    - `var dataPath = data_field.data_url;`
    - `var baseUrl = data_field.base_url;`
* Find and replace URLs with variables
    - Replace `"../data/copy.csv"` with `copyPath`
    - Replace `"../data/composite-score.csv"` with `dataPath`
    - Replace `"https://pathfinder.sevenmilemedia.com"` with `baseUrl`

### Export indicator pages
* In `./rollup.config.js` change line 38 to the file path of your local Wordpress installation `file: '../../wordpress/pathfinderlocal/app/public/wp-content/themes/pathfinder-child/dashboard/growth/bundle.js'`
* In `./src/views/Indicators.svelte` change line 44 to `$areaInView = 'growth';`
* Run `npm run build`
* Add these lines at the top of the exported file `growth/bundle.js`
    - `var visualContainer = data_field.container;`
    - `var copyPath = data_field.copy_url;`
    - `var dataPath = data_field.data_url;`
    - `var compositePath = data_field.composite_url;`
    - `var baseUrl = data_field.base_url;`
* Find and replace URLs with variables
    - Replace `"pathfinder-dashboard-container"` with `visualContainer`
    - Replace `"../data/copy.csv"` with `copyPath`
    - Replace `""./data/indicators/"+A+".csv""` with `dataPath`
    - Replace `"../data/composite-score.csv"` with `compositePath`
    - Replace `"https://pathfinder.sevenmilemedia.com"` with `baseUrl`
* Repeat this process with the remaining indicator pages

# venn
venn diagram

Solution is inspired by Ben Frederickson and his GitHub repo https://github.com/benfred/venn.js

FEATURES INCLUDE

- Imports a default JSON dataset
- Exports current JSON dataset 
- Toggle button for light/dark styling
- Custom option settings for
  - document title
  - page title
  - light / dark page styling
  - light / dark page display
  - narrative heading
  - narrative text 
  - showing stats
  
DATA SCHEMA

For every circle these data are required:
- sets:[integer] - index identifies the circle
- size:integer - used to calculate sizes
- label:string - text to be displayed
  
To display an intersection these data are required:
- sets[array]: 2 or more integers identifying the intersecting circles
- size: integer size of the intersection
- label: string text for the intersection label
  
OTHER SETTINGS
- doc_title:string - Title of the web page 
- page_title:string - text displayed lower right of the page
- narrative:string - long text displayed here
- heading:string - text displayed above the narrative
- style_option:boolean - sets the style mode to light or dark
- show_stats:boolean - show statistics for each circle here


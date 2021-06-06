# journey_map
USER JOURNEY MAP

Solution is inspired by d3.js Scatter Plot examples like these:
 http://bl.ocks.org/weiglemc/6185069

FEATURES INCLUDE

- Auto loads a default CSV data set.
- Import new csv data to update the chart - your data remains local, not uploaded anywhere.
- Export the chart data to CSV file.
- Toggle button for light/dark styling.
- Import custom config settings (config.csv) for 
  - page title
  - light / dark page styling


DATA MODEL
row: number, number between 1-3 ( 1 = Stages, 2 = Steps, 3 = Touch Points)
col: number, identifies the column (Stage) for display
seq: number, used to control the order of text displayed in each column
text: string, text to display as a bullet
description: string, providing as much details for the item as desired as a popup

TIPS
Be sure to escape QUOTES and COMMAS in your CSV data to preserve formatting



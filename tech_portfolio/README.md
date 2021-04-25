# app_portfolio
application portfolio matrix

Solution is inspired by d3.js Scatter Plot examples like these:
 http://bl.ocks.org/weiglemc/6185069

FEATURES INCLUDE

- Imports a default CSV data set
- Toggle button for light/dark styling
- Import custom config settings (config.csv) for 
  - page title
  - light / dark page styling
  - light / dark page display
  - customized chart legends
  - customized chart title
- Import new csv data to update the chart without uploading - your data remains local
- Export the chart data to CSV file

This Application Portfolio Matrix is created based on the TIME method of assessing an applications value to the enterprise.
Read more about Application Portfolio Management in this article.
https://blog.planview.com/5-key-strategies-to-application-portfolio-management/


The TIME Chart consists of four high-level categories:

- Tolerate:The applications in this group are those that deliver business value but are not necessarily built on modern platforms or well-integrated with the company’s infrastructure.

- Invest/Innovate/Integrate: This grouping of applications shows great promise to deliver significant business value but will require the company to invest in integrating or upgrading existing infrastructure to ensure that these applications are able to function at the highest level.

- Migrate/Modernize/Remediate: This application category refers to technologies that involve software that is no longer supported or rely on a small group of human resources with specialized knowledge.

- Eliminate: In addition to redundant applications, you may find in your scoring that some of the applications in your inventory have little to no business value, or that the costs of operating the application far outweigh the results delivered. In these situations, such applications should be marked for elimination.

DATA MODEL

id: unique id of the Application
name: name of the Application
production_status: 
- -1 = Deprecated 
- -2 = Decommissioned
- 2 = In Development
- 4 = In Production

arb_status: (Architectural Review Board)
- 1 = proposed
- 2 = under review
- 3 = approved
- 4 = released

domain: Name of the Domain

description: details about the application

a_value: 1-10 (business value)

b_value: 1-10 (technical merit)

plot: Concatenate a_value + "_" + b_value




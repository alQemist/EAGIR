# d3-erd
 Entity Relationship Diagram written in d3.v4
 Based on Mike Bostock's Force Dragging 1 example https://bl.ocks.org/mbostock/2675ff61ea5e063ede2b5d63c08020c7

Designed to produce a data-driven Entity Relationship Diagram from a Data Dictionary.


This solution was just one facet of a larger Enterprise Architecture project undertaken to model and document the business domains and their relationships to the data architecture.

The Data Dictionary was used as the source of data driving the ERD. Whatever the data source the model should be as follows:
    
        title: Title of the chart

        style_option: toggles the style from light to dark modes

        is_fixed: boolean, all elements are in fixed positions (1) or float (0)

       data.entity:      name of entity (can be singular or plural)

       data.data.entity_key:  singular name of entity  (must be singular as its used to create the relationships)

       data.entity_id:   unique entity id

       data.*fixed_x:     x position as a decimal (percentage),

       data.*fixed_y:     y position as a decimal (percentage),

       data.status":     boolean indicator that entity is approved for release,

       data.description: description of the data used for tooltips,

       data.columns:       json array of columns under each entity 
   
                status:boolean indicator that data is approved for release,
                
                column:column name
                
                description: column description
                
                relationship: optional, one of the following values
		
				11 - One and only One
				1M - One or Many
				M - Many
				01 - Zero or One
				0M - Zero or Many
				arrow - included for miscellaneous use
                              
   domain:      name of domain the entity is under
   
	   Sample JSON

        {
        "title": "ENTITY RELATIONSHIP DIAGRAM",
        "style_option": 1,
        "is_fixed": true,
          data:[{
            "entity": "assessments",
            "entity_key": "assessment",
            "entity_id": "16",
            "fixed_x": "0.638562",
            "fixed_y": "0.291789",
            "physical": "1",
            "status": "0",
            "description": null,
            "columns": [{
                "status":1,"label":id,"description":"id for the assessment record","relationship":""
            }],
	    "domain": "Clinical Assessments"
	  }]
}

* NOTE: fixed_x and fixed_y values are ignored if the "is_fixed" is 0, this allows the forceDirected layout to "run".

DRAGGING AND SAVING NEW NODE POSITIONS:

Saving new positions for dragged nodes happens automatically if settings in the api.js beginning on line 74

    setTimeout(function(){
    //getJsonData(load) // load data from database, automatic saves
    getJsonData() // load data from local file and save changes to a local json file.
    },100)



# ea
Enterprise Architecture Capabilities Map

This capabilities map is a visualization of capabilities documentation as part of a larger Domain Modeling project.

Developed using all open-source technologies with the goal of having data driven documentation and visualizations which take advantage of the ability to realize the relationships between data.

The hierarchial model of the Domain and Capabilties gives stakeholders a broader context of the Enterprise and the states of development of the software application.

JSON DATA SCHEMA

The capability source data is structure into a 4 tier hierarchy.

DOMAIN -> SUBDOMAIN -> CAPABILITY -> APPLICATION (optional)

This TREE data structure is required to create the visualization with the data structured using Parent->Name relationship.
Each "Parent" element will automatically be connected to  "Name" element(s) which have the same value.


DOMAIN In this demo is the Enterprise - the master entitiy of the organization.
SUBDOMAINS are organizational (sub)divisions which represent specialized business operations or functions
CAPABILITIES can be systems, software, processes, or other resources required to produce value to stakeholders
APPLICATION are identifiable software or systems which deliver the required capability

DATA REQUIREMENTS
- There need to 1 and only 1 DOMAIN  (eg. "type:domain")
- There need to be at least 1, or more, SUBDOMAINS  (eg. "type:subdomain")
- There need to be at least 1, or more, CAPABILITIES (eg. "type:capability")
- There can be 0 or more APPLICATIONS (eg. "type:application")

SAMPLE JSON
```` YAML
[
  {
    "parent": "",
    "name": "Enterprise",
    "type": "domain",
    "links": "", 
    "description": "Describe this domain", 
    "state": "0", 
    "implemented": null
  },
  {
    "parent": "Enterprise",
    "name": "Business Operations",
    "type": "subdomain",
    "links": "",
    "description": "describe the subdomain",
    "state": "1",
    "implemented": null
  },
  {
    "parent": "Business Operations",
    "name": "Account Management",
    "type": "capability",
    "links": "",
    "description": "Ability to add new account",
    "state": "0",
    "implemented": null
  },
  {
    "parent": "Account Management",
    "name": "ERP System",
    "type": "application",
    "links": "",
    "description": "Business software",
    "state": "1",
    "implemented": null
  }]

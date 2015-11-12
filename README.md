# Fake Partner

## Requirements

* Node v4.2.1 (other versions may also work)
* Chrome v46+

## Installation

* `npm i`
* `cp config/default.js config/development.js`

##### Create a development.js file

    .
    ├── ...
    ├── config
    │   ├── default.js          # Copy the contents of this file
    │   ├── development.js      # Create this file
    │   └── index.js
    └── ...

* Run fake-partner using `npm start`
* Open Chrome and navigate to `http://localhost:3031/`


## Getting started
* Select `https://alphasandbox.doshii.co/partner/api/v1` from the dropdown list
* Paste the ClientId and ClientSecret into the fields.
* On successful connection, a connect event will be emitted in the console

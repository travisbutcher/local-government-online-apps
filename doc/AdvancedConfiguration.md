# Advanced configuration

## Web mapping applications

Some resources.arcgis.com background about web mapping applications:

* [Creating web application templates](http://resources.arcgis.com/en/help/arcgisonline/index.html#/Creating_web_application_templates/010q00000072000000/)
* [Adding configurable parameters to templates](http://resources.arcgis.com/en/help/arcgisonline/index.html#/Adding_configurable_parameters_to_templates/010q000000ns000000/)

A web mapping application uses three arcgis.com items; each item has the usual arcgis.com description content plus a data
section.  The key WMA item in the description is the URL.

1.  web mapping application-ties a template and webmap together and stores some customizations
    1.  description's URL:  points to application's software with a parameter for the WMA's arcgis.com ID; e.g.,
    http://localgovtemplates2.esri.com/online/s2.html?appid=a915b6cb73d640b0834ee607b91c8141; this is copied from the template
    when the WMA is created
    2.  data section:
        1.  arcgis.com id of the template that was used to create the WMA
        2.  arcgis.com id of the webmap that was used to create the WMA
        3.  WMA-specific overrides to the default values for the basic configuration (By "basic configuration", I'm referring
        to the configuration that one can do post-publication such as title, color, etc.)
2.  web mapping application template-defines the basic customization UI and provides the URL to the underlying software used by
the WMA
    1.  description's URL:  points to application's software only; e.g., http://localgovtemplates2.esri.com/online/s2.html
    2.  data section:  a JSON structure with 2-3 parts
        1.  "values":  the default values for the basic configuration (quotes are used because that's the JSON format-tag-value
        pairs, with tags as quoted strings)
        2.  "configuration":  the UI for the basic configuration
        3.  "ui":  (optional, ParcelViewer only):  the UI for the WMA itself
3.  webmap
    1.  description's URL:  not used
    2.  data section:
        1.  "operationalLayers"
        2.  "baseMap"
        3.  "version"

### local-government-online-apps' extension of the web mapping application

The out-of-the-box ParcelViewer uses a "ui" section from a file hosted with the underlying software, and this UI doesn't open a
splash screen.  But the software supports this feature-we just have to change the UI.  To keep the whole caboodle in arcgis.com,
we'll create a web mapping application template that includes the "ui" section, and all WMAs created from that template will use
that feature.

If you were to take the apps2/ParcelViewer.json file and copy it into a web mapping application template (see
[Adding configurable parameters to templates](http://resources.arcgis.com/en/help/arcgisonline/index.html#/Adding_configurable_parameters_to_templates/010q000000ns000000/)),
you'd get the out-of-the-box ParcelViewer.  (The apps2/ParcelViewer_template.json
file is the ParcelViewer.json file without the "ui" section.)  So if we make the modification described below
[below](https://github.com/Esri/local-government-online-apps/blob/master/doc/AdvancedConfiguration.md#another-advanced-configuration--show-the-help-text-upon-launch)
to the ParcelViewer.json file before pasting it into the template, we'll get the splash screen.


## A sample advanced configuration

We can override the default configuration by specifying a configuration file on your server using a URL
parameter.  To illustrate this, copy `apps2\ParcelViewer.json` into `apps2\Color.json`, then edit
`Color.json`.  We'll change the meaning of the color theme "DarkGray" from

* foreground color:  #fff
* background color:  #333333
* highlight color:  #5d5d5d

to

* foreground color:  #fff
* background color:  #555
* highlight color:  #888

We do this by changing the JSON configuration file’s line 105 from

    "colors": ["#fff", "#333333", "#5d5d5d"]

to

    "colors": ["#fff", "#555", "#888"]

(This change gives us a way to verify that we're not using the default configuration file).  Now try
`http://<yourServer>/<yourSite>/ParcelViewer.html?app=apps2/Color` (if you're starting with the Parcel Viewer template
download) or `http://<yourServer>/<yourSite>/s2.html?app=apps2/Color` (if you're starting with the GitHub repository)
and you'll see that the app color theme, while still configured as "DarkGray", is lighter both in its
background and in its highlighting as you hover over menu buttons.


## Another advanced configuration:  change the custom utility services

The application is configured to use four services:

1. Bing maps key
2. Geometry server URL
3. Printing task URL
4. Geocoding server URL

These service parameters are all stored in the file commonConfig.js. Each URL parameter is preceded by
"location.protocol +" so that it will work whether your site uses http or https. The commonConfig.js file
settings are only used to provide a backup if corresponding online services are missing -- online-provided
services take priority if they exist.


## Another advanced configuration:  show the help text upon launch

For this, we'll add to our configuration an instance of class `js.LGCallMethods`; this class calls
methods of objects.  The help text is shown in a `js.LGMessageBox`, which has `js.LGGraphic` as an
ancestor.  `js.LGGraphic` has the method `setIsVisible()`, which takes true or false as its only
argument to make the graphic visible or invisible, respectively.  Since the `js.LGMessageBox` item was
named "helpMessageBox" in the supplied JSON configuration file, change the end of the supplied JSON
configuration file from

        }]
    }

to

        }, {
            "classname": "js.LGCallMethods",
            "config": {
                "todo": [
                    {"rootId": "helpMessageBox", "method": "setIsVisible", "arg": "true"}
                ]
            }
        }]
    }

to get the help display to appear as the app starts.


## Another advanced configuration:  show the search box as a left-side, top-to-bottom sidebar

For this, we'll change the positioning configuration for the search box.  The search box is an instance
of class `js.LGSearchBoxByText`, which has `js.LGGraphic` as an ancestor.  `js.LGGraphic` has two
parameters called `horizOffset` and `vertOffset` to guide the positioning of the graphic.  These
parameters take a single number or a pair of numbers.  Numbers greater than zero stand for the offset
from the left (for `horizOffset`) or top (for `vertOffset`) in pixels; numbers less than zero stand for
the offset from the right or bottom; numbers equal to zero indicate centering.  A pair of numbers
permits you to tie the graphic to both edges.  E.g., the original values in the supplied JSON
configuration file are

    "horizOffset": -2,
    "vertOffset": [2, -2],

which mean that

* horizontally, the search box is two pixels from the right edge of the map area
* vertically, the search box is two pixels from the top and bottom edges of the map area

If a maximum width or height constraint exists in CSS, then the right/bottom constraint in a pair of
numbers is overridden by the CSS if the map area is larger than the maximum.  In the supplied JSON
configuration file, e.g., there is a `max-height:224px;` in the `styles` (CSS) part of the
`js.LGSearchBoxByText` configuration, so the search box will not be two pixels from the bottom until
the map window gets shorter than 229 pixels.

So two changes are made for this customization:

* change `horizOffset`'s value to 2
* remove the `max-height:224px;` text from the item's styles.

The new search box definition becomes

    }, {
        "classname": "js.LGSearchBoxByText",
        "styles": ".searchBox{display:none;width:200px;padding:4px;position:absolute;overflow:hidden;z-index:40;word-wrap:break-word}.okIE .searchBox{border-radius:8px}.resultsListBox{width:96%;top:53px;overflow:auto}.okIE .resultsListBox{position:absolute;bottom:4px}.lt-ie9 .resultsListBox{width:100%;height:182px}.resultsListTable{width:97%;margin:4px}.lt-ie9 .resultsListTable{width:87%}.resultsListBody{width:80%}.resultsListSearching{background-image:url('images/loading.gif');background-position:center center;background-repeat:no-repeat;width:100%;height:1.5em}.resultsListEntry{width:84%;margin:2px;padding:4px;cursor:pointer}",
        "config": {
            "trigger": "search",
            "publish": "showFeature",
            "parentDiv": "contentFrame",
            "rootId": "searchBox",
            "rootClass": "searchBox",
            "horizOffset": 2,
            "vertOffset": [2, -2],
            "searcher": "featureSearcher",
            "showPrompt": "@prompts.search",
            "resultsListBoxClass": "resultsListBox",
            "resultsListTableClass": "resultsListTable",
            "resultsListBodyClass": "resultsListBody",
            "resultsListSearchingClass": "resultsListSearching",
            "resultsListEntryClass": "resultsListEntry"
        }
    }, {


## Question:  why don't you wrap the long "styles" lines?

In order to help catch typographic errors, our configuration files are run through a
JSON validator such as [JSONLint](http://jsonlint.com/). Inserting a break into the `styles`
string would create invalid JSON, so we leave the text continuous to be able to use a validator.

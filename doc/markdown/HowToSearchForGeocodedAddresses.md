[example of searching for an address]: images/ParcelViewerSearchAddress.png "example of searching for an address"

[search entry box]: images/ParcelViewerSearch.png "search entry box"
[address searcher]: images/addressLocatorSearcher.png "address searcher"
[feature layer searcher]: images/featureLayerSearcher.png "feature layer searcher"
[multiplex multiple searchers]: images/multiplexerSearcher.png "multiplex multiple searchers"
[multiple feature layer searcher]: images/featureLayerMultiplexerSearcher.png "multiple feature layer searcher"
[address searcher + multiple feature layer searcher]: images/multiplexerSearcher2.png "address searcher + multiple feature layer searcher"

[js.LGSearch]: http://localgovtemplates2.esri.com/support/local-government-online-apps/doc/js2_doc/js.LGSearch.html
[js.LGSearchFeatureLayer]: http://localgovtemplates2.esri.com/support/local-government-online-apps/doc/js2_doc/js.LGSearchFeatureLayer.html
[js.LGSearchAddress]: http://localgovtemplates2.esri.com/support/local-government-online-apps/doc/js2_doc/js.LGSearchAddress.html
[js.LGSearchMultiplexer]: http://localgovtemplates2.esri.com/support/local-government-online-apps/doc/js2_doc/js.LGSearchMultiplexer.html
[js.LGSearchFeatureLayerMultiplexer]: http://localgovtemplates2.esri.com/support/local-government-online-apps/doc/js2_doc/js.LGSearchFeatureLayerMultiplexer.html
[js.LGSearchBoxByText]: http://localgovtemplates2.esri.com/support/local-government-online-apps/doc/js2_doc/js.LGSearchBoxByText.html

[SearchAddress.json]: ../examples2/SearchAddress.json

[app configuration file]: UnderstandingConfigurationFile.md
[create a custom template]: HowToCreateCustomTemplate.md
[apps2/ folder]: ../../apps2/
[Solutions online apps GitHub site]: https://github.com/Esri/local-government-online-apps
[doc/examples2/ folder]: ../examples2/
[nls/ folder]: ../../nls/
[Resources]: Resources.md
[Esri Support]: http://support.esri.com/
[LICENSE.txt]: ../../LICENSE.txt

![](images/configuring.png)

## How to Search for Geocoded Addresses

> Configuration hides/exposes/moves existing functionality only and these changes are supported by [Esri Support][].
> Apps with configuration changes may be hosted in ArcGIS Online or on your server.

### Summary

We will modify an [app configuration file][] in the repository and use its contents to [create a custom template][]. Any of the app configuration files in the repository's [apps2/ folder] can be used as a starting point.

In this case, the change expands the search capability to search Esri's World Geocode Service for an address in addition to searching one or more feature layers.

---

### Procedure

1. Open the app's configuration file from the apps2 directory. Alternatively, complete the following steps using a a copy of apps2/ParcelViewer.json. Compare the end result to [SearchAddress.json][] in the repository's [doc/examples2/ folder][] to confirm you've made the changes correctly.

2. Open the configuration file in a text editor and search for the name of the JavaScript class that holds the standard Finder searcher that allows you to search multiple fields in multiple map layers:

    	"classname": "js.LGSearchFeatureLayerMultiplexer"

3. After this component, add components for [js.LGSearchAddress][] (geocode search) and [js.LGSearchMultiplexer][] (combines the geocode and feature search information).  The result will look like this:


	    }, {
	        "classname": "js.LGSearchFeatureLayerMultiplexer",
	        "config": {
	            "rootId": "featureSearcher",
	            "parentDiv": "contentFrame",
	            "dependencyId": "map",
	            "busyIndicator": "busyIndicator",
	            "publishPointsOnly": false,
	            "searchPattern": "%${1}%",
	            "caseInsensitiveSearch": true
	        }
	    }, {
	        "classname": "js.LGSearchAddress",
	        "config": {
	            "rootId": "addressSearcher",
	            "parentDiv": "contentFrame",
	            "dependencyId": "map",
	            "searchUrl": "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
	            "addressParamName": "SingleLine",
	            "minimumScore": 80,
	            "validLocators": ["USA.StreetName", "USA.PointAddress", "USA.StreetAddress"],
	            "outWkid": 102100,
	            "outFields": ["Loc_name", "Match_addr"]
	        }
	    }, {
	        "classname": "js.LGSearchMultiplexer",
	        "config": {
	            "rootId": "multiSearcher",
	            "parentDiv": "contentFrame",
	            "searcherNames": [
	                "featureSearcher",
	                "addressSearcher"
	            ]
	        }
	    }, {


    > Note how LGSearchMultiplexer references the rootId values from both  [js.LGSearchFeatureLayerMultiplexer][] (featureSearcher) and [js.LGSearchAddress][] (addressSearcher).

4. Copy the "rootId" configuration parameter of the [js.LGSearchMultiplexer][] component that we just added; in this example, it's "multiSearcher".

5. Search the configuration file for [js.LGSearchBoxByText][]. This will take you tot he section of the configuration file that deals with the search widget.

	    "classname": "js.LGSearchBoxByText"

6. Change the "searcher" configuration parameter of the [js.LGSearchBoxByText][] component to have it use the rootId value from the [js.LGSearchMultiplexer][] component:

		"searcher": "featureSearcher",

	becomes

	    "searcher": "multiSearcher",

	This points the search widget at the component that references both the feature search and the address search. Alternatively, you could point the widget at only the address search using:

		"searcher": "addressSearcher"

	which references the rootId from [js.LGSearchAddress][] and will only search using the geocode service.

7. Save and lint the configuration file, then copy its contents into the Configuration Parameters section if the Item Details page of a new custom template. Publish a map, and when your user searches, the search will look in both the address geocoder and in the feature layers.

    ![example of searching for an address][]

-----

#### Understanding search configuration

When your user clicks on the magnifying glass, he/she sees a search box with a type-in field for the search.

![search entry box][]

In the web app user interface configuration, this search box is linked to a searcher class. The app's JavaScript library has several searcher classes; because each searcher has the same interface, the box can use any one of them:

*  **[js.LGSearchFeatureLayer][]** searches a feature layer by text. This is the searcher that the standard Parcel Viewer used before the December 2013 release.

    ![feature layer searcher][]

*  **[js.LGSearchAddress][]** searches a geocoder by an address.

    ![address searcher][]

*  **[js.LGSearchMultiplexer][]** permits a mix of any number of other types of searchers. The search box is still working with one searcher; that searcher coordinates the efforts of one or more other searchers.

    ![multiplex multiple searchers][]

*  **[js.LGSearchFeatureLayerMultiplexer][]** is a small modification to LGSearchMultiplexer that permits feature layer subsearchers to be specified by listing them by name in a string; once the component is created, it behaves exactly the same as LGSearchMultiplexer. (This is the searcher that the standard Solutions apps use.) An advantage of this searcher over the LGSearchMultiplexer is that you don't have to set up LGSearchFeatureLayer subsearchers in the configuration because  LGSearchFeatureLayerMultiplexer constructs them as needed based on layer names listed in the publication configuration.

    ![multiple feature layer searcher][]


> An aside for fans of object-oriented programming: The Solutions library contains an abstract class named [js.LGSearch][] that defines the class interface for searchers. [js.LGSearchFeatureLayer][], [js.LGSearchAddress][], and [js.LGSearchMultiplexer][] are subclasses of [js.LGSearch][]. [js.LGSearchFeatureLayerMultiplexer][] is a subclass of [js.LGSearchMultiplexer][] that initializes differently but otherwise is the same.

#### How to use the classes for address AND feature layer searching

We'll add an address searcher to the existing Parcel Viewer by using a js.LGMultiplexer to coordinate an address search with the existing multiple-feature-layer search.

![address searcher + multiple feature layer searcher][]

#### How are the components linked?

The search box component is implemented by the JavaScript class [js.LGSearchBoxByText][]. One of its configuration parameters is "searcher", which is the name (rootId) of the searcher to use. If you look at the standard Parcel Viewer, you'll see the following component definition (the "styles" portion is truncated to fit this page):

```json
}, {
    "classname": "js.LGSearchBoxByText",
    "styles": ".searchBox{display:none;width:200px; ... cursor:pointer}",
    "config": {
        "rootId": "searchBox",
        "trigger": "search",
        "publish": "showFeature",
        "parentDiv": "contentFrame",
        "rootClass": "searchBox",
        "horizOffset": -2,
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
```

So what is the "featureSearcher" component? It's a [js.LGSearchFeatureLayerMultiplexer][]:

```json
}, {
    "classname": "js.LGSearchFeatureLayerMultiplexer",
    "config": {
        "rootId": "featureSearcher",
        "parentDiv": "contentFrame",
        "dependencyId": "map",
        "busyIndicator": "busyIndicator",
        "publishPointsOnly": false,
        "searchPattern": "%${1}%",
        "caseInsensitiveSearch": true
    }
}, {
```

Note that this config section is missing any mention of layer names or search fields. This is because this part of the configuration is done via the publication configuration user interface. You'll find them up near the top of the page in the "values" and "configurationSettings" sections:

```json
"featureSearcher.searchLayerName": "Parcel Details",
"featureSearcher.searchFields": "SITEADDRESS,CNVYNAME,PARCELID",
    :               :               :               :
    :               :               :               :
    :               :               :               :
}, {
    "label": "Search layer name(s)",
    "fieldName": "featureSearcher.searchLayerName",
    "type": "string",
    "tooltip": "Comma-separated list of the feature layer(s) to use for a search"
}, {
    "label": "Search layer field(s)",
    "fieldName": "featureSearcher.searchFields",
    "type": "string",
    "tooltip": "Comma-separated list of the field(s) to look at during a search"
}, {
```

The tag in the "values" section is a compound name (e.g., `featureSearcher.searchLayerName`) because it identifies both the name of the component owning the value ("featureSearcher") and the configuration item ("searchLayerName") in that component.

----------


----------
### Related information

All app source code is available from the [Solutions online apps GitHub site][]; this article's template configuration is [SearchAddress.json][] in the repository's [doc/examples2/ folder][].

Because it can be very easy to make a small typing error, we strongly recommend "linting" your changed files to validate their syntax. All JavaScript & JSON in the repository is validated except for third-party libraries. Additional information is available on the [Resources][] page.

Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.

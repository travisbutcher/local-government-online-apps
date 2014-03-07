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

For this article, our change expands the search capability to search Esri's World/GeocodeServer for an address in addition to searching one or more feature layers.

#### How searching is performed

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
### Procedure

* Make a copy of apps2/ParcelViewer.json; we'll call it SearchAddress.json for this exercise, but the name doesn't matter.

* Open SearchAddress.json in a text editor and search for the name of the JavaScript class that holds the standard Finder searcher:

    ```json
    "classname": "js.LGSearchFeatureLayerMultiplexer"
    ```

* After this component, we'll add components for [js.LGSearchAddress][] and [js.LGSearchMultiplexer][]; the result will look like this:

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
    ```

    > Note how LGSearchMultiplexer has configuration parameters that refer to the [js.LGSearchFeatureLayerMultiplexer][] and [js.LGSearchAddress][] components by name.

* Copy the "rootId" configuration parameter of the [js.LGSearchMultiplexer][] component that we just added; in this example, it's "multiSearcher".

* Search for [js.LGSearchBoxByText][], the box that uses a searcher:

    ```json
    "classname": "js.LGSearchBoxByText"
    ```

* Change the "searcher" configuration parameter of the [js.LGSearchBoxByText][] component to have it use the [js.LGSearchMultiplexer][] component:

    ```json
    "searcher": "multiSearcher",
    ```

* Save and lint SearchAddress.json; copy its contents into a new custom template's Configuration Parameters. Publish a map, and when your user searches, the search will look in both the address geocoder and in the feature layers.

    ![example of searching for an address][]

----------
### Related information

All app source code is available from the [Solutions online apps GitHub site][]; this article's template configuration is [SearchAddress.json][] in the repository's [doc/examples2/ folder][].

Because it can be very easy to make a small typing error, we strongly recommend "linting" your changed files to validate their syntax. All JavaScript & JSON in the repository is validated except for third-party libraries and the computer-generated language-specific phrase files in the [nls/ folder][]. Additional information is available on the [Resources][] page.

Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.

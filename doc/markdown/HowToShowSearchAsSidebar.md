[js.LGSearchBoxByText]: http://localgovtemplates2.esri.com/support/local-government-online-apps/doc/js2_doc/js.LGSearchBoxByText.html
[js.LGGraphic]: http://localgovtemplates2.esri.com/support/local-government-online-apps/doc/js2_doc/js.LGGraphic.html
[StartWithSplash.json]: ../examples2/StartWithSplash.json

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

## How to Show Search as a Sidebar

> Configuration hides/exposes/moves existing functionality only and these changes are supported by [Esri Support][].
> Apps with configuration changes may be hosted in ArcGIS Online or on your server.

### Summary

We will modify an [app configuration file][] in the repository and use its contents to [create a custom template][]. Any of the app configuration files in the repository's [apps2/ folder] can be used as a starting point.

For this article, we'll change the positioning configuration for the search box.

The search box is an instance of class [js.LGSearchBoxByText][], which has [js.LGGraphic][] as an ancestor. [js.LGGraphic][] has two parameters called horizOffset and vertOffset to guide the positioning of the graphic. These parameters take a single number or a pair of numbers. Numbers greater than zero stand for the offset from the left (for horizOffset) or top (for vertOffset) in pixels; numbers less than zero stand for the offset from the right or bottom; numbers equal to zero indicate centering. A pair of numbers permits you to tie the graphic to both edges. E.g., the original values in the supplied JSON configuration file are

    "horizOffset": -2,
    "vertOffset": [2, -2],

which mean that

- horizontally, the search box is two pixels from the right edge of the map area
- vertically, the search box is two pixels from the top and bottom edges of the map area

If a maximum width or height constraint exists in CSS, then the right/bottom constraint in a pair of numbers is overridden by the CSS if the map area is larger than the maximum. In the supplied JSON configuration file, e.g., there is a max-height:224px; in the styles (CSS) part of the [js.LGSearchBoxByText][] configuration, so the search box will not be two pixels from the bottom until the map window gets shorter than 229 pixels.

----------
### Procedure

* Make a copy of apps2/ParcelViewer.json; we'll call it Sidebar.json for this exercise, but the name doesn't matter.

* Open Sidebar.json in a text editor and search for

        "classname": "js.LGSearchBoxByText",

* Change horizOffset's value to 2
- Remove the max-height:224px; text from the item's styles.

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


* Save and lint StartWithSplash.json; copy its contents into a new custom template's Configuration Parameters. Publish a map, and the search widget will appear in the new location.

----------
### Related information

All app source code is available from the [Solutions online apps GitHub site][].

Because it can be very easy to make a small typing error, we strongly recommend "linting" your changed files to validate their syntax. All JavaScript & JSON in the repository is validated except for third-party libraries. Additional information is available on the [Resources][] page.

Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.
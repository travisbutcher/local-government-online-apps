# Getting started with configuring the online apps

## I downloaded the app--now what?

It is ready to run using sample data, so you can set it up on your server to test that it will
work in that environment.  A good starting URL after the appropriate server and site name substitutions
would simply be `http://<yourServer>/<yourSite>/s1.html`.  Zoom in a bit and click on a parcel to get
its details popup (defined in the sample data's webmap).  Try a search for a parcel (e.g., "1916301027")
or an address (e.g., "42757 Woodward Ave").  Change the basemap.  Send the current extents to someone via
email.

With familiarity about what the app does, you can see where you want to customize it.  To begin, we need
to understand how to configure the app.

### Two tiers of configuration

There are two tiers of configuration that can be done without changing the JavaScript software:

1. Basic configuration:  title, color theme, search layer, etc.
2. Advanced configuration:  icons, menu options, UI-element placing & sizing, etc.

Basic configuration is done as part of publishing a webmap into a web application, and one uses the
ArcGIS Online configuration user interface to perform it.  Normally, just a few items are presented at
this level.

Advanced configuration is an optional part of setting up a web application template for your webmap
publishers, and one uses a text editor to perform it.  It specifies which UI elements are to appear,
the order in which they are to appear, and the CSS to display them.  There is no need to modify this
part of a web application template in order to use the app--it is only there to make it easier to modify
the app without touching the JavaScript or to customize the app without having to host it.

### Elements of the basic configuration

The basic configuration is divided into two sections: Title and Map.

The Title section has a type-in box for the banner title and for the URL to the icon to use for the app
in the banner; the URL can be local (e.g., the default "images/onlineapp.png" points to an image in the
hosting site's "images" folder) or the full URL to an image on another site.

The image is scaled to 48 pixels high to fit in the banner; its width is scaled by the same ratio as the
height is scaled, but is not constrained to a fixed width: it is possible to have a rectangular image.
Images may be PNG, GIF, or JPEG.

The Map section has type-in boxes for the hint--the text that appears as a hint when one starts a
search--and for the search layer and basemap group settings.

#### Search layer

One configures the search layer using two type-in boxes: layer name and layer field(s). If the
specified name (e.g., the default "Parcel Details") is not found in the webmap, a box pops up
reporting this problem and listing the available layers in the webmap. *Important note: At this
time, the app is not able to get access to layers within other layers. The search layer needs
to be a top-level layer.*

Once you've supplied the name of a layer, you'll supply the names of one or more of that layer's fields
that will be searched whenever your user enters text into the app's search box. Field names should
match the ones in the layer exactly, including their case. Multiple field names are separated by commas.

If a specified field is not found in the search layer, a box pops up
reporting this problem and listing the available fields in the search layer. (Note that you'll
need to save any changes to the search layer name before this field name check will be useful.)

#### Basemap group

One configures the basemap group using two type-in boxes: group name and group owner. The group name
is the name of an arcgis.com group that contains the set of basemaps that you want to offer with this
app; the group owner is the arcgis.com login name of the owner of that group. If these fields are left
blank, then a default set of basemaps is supplied by Esri.

### How an app's configuration is stored

The online app is designed to be a generic, shared, and reusable set of software that is transformed
into an app using data from a configuration written in JSON.  The configuration has three parts:

* "configurationSettings":  the basic configuration user interface
* "values":  the default values for the basic configuration
* "ui":  the advanced configuration

These configuration parameters may be stored in a web application template in ArcGIS Online or in a file
on a server.  The initial release of the Parcel Viewer app, e.g., stores its configurationSettings and
values in a template and its ui in a file, but one could put all three in a template or all three in a
file.

When you use the app out of the box, it uses a default configuration completely defined in a file found
in the `apps1` folder, the `ParcelViewer.json` file.

## A sample advanced configuration

We can override the default configuration by specifying a configuration file on your server using a URL
parameter.  To illustrate this, copy `apps1\ParcelViewer.json` into `apps1\Color.json`, then edit
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
`http://<yourServer>/<yourSite>/s1.html?app=apps1/Color`
and you'll see that the app color theme, while still configured as "DarkGray", is lighter both in its
background and in its highlighting as you hover over menu buttons.

## Configuration sources

Another way for the app to get the configuration is from an ArcGIS Online web application.  Each web
application has a unique ID, e.g., "a915b6cb73d640b0834ee607b91c8141".  You can have the app use the
configuration from that web application via the URL parameter "appid":
`http://<yourServer>/<yourSite>/s1.html?appid=28d43bbf94e4499fbb71e1e19a261d60`

This is the configuration that is used by hosted applications, which would use
`http://www.arcgis.com/apps/Solutions/s1.html?appid=28d43bbf94e4499fbb71e1e19a261d60`
for this app.

If you want to always have your users use `Color.json` for the advanced configuration, you can change
line 60 in `js1\lgonlineStart.js` from

    (new js.LGUIBuilder(window.location.search, null, "apps1/ParcelViewer")).ready.then(

to

    (new js.LGUIBuilder(window.location.search, "apps1/Color")).ready.then(

This change gives you complete control over where the advanced configuration comes from:  It instructs
the app to use `apps1/Color.json` for the advanced configuration regardless of whether the URL has "app="
or "appid=".  (We also removed the default configuration file specification--the third argument--for
clarity.)  Note that basic configuration will still come from the appid if it is supplied, but if
you've changed the meaning of "DarkGray" and you deleted Twitter and Facebook from the sharing menu in
your JSON configuration file, then those changes will exist regardless of the advanced configuration in
the web application.  For example, try
`http://<yourServer>/<yourSite>/s1.html?appid=28d43bbf94e4499fbb71e1e19a261d60`
again after making this change.


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


## Question:  why is there s1.html and s2.html, js1 and js2, apps1 and apps2?

The main HTML file has a name that reflects its membership in a series of generic apps rather than a
particular configuration of the apps.  This was done because the actual app is driven by the JSON
configuration:  `s1.html` launched with `apps1\ParcelViewer.json` creates a Parcel Viewer app, but
it can also be launched with your own `HydrantFinder.json`, or `ParkSearch.json`, or....

We've organized the releases into series, with the initial release being series 1.  The idea is that,
apart from significant errors or ArcGIS Online hosting rule changes, a series will be left alone once
it is released so that we don't inadvertently break your app configurations or require you to migrate
your JavaScript modifications.  App configurations will be copied into subsequent series and tested
within those environments, so with the next online apps release, the Esri-supplied ParcelViewer web
application template will start using the next series for *new* web applications--already-published
web applications have a URL within them pointing to the series under which they were published and
will not need to be changed.


## Question:  why don't you wrap the long "styles" lines?

In order to help catch typographic errors, our configuration files are run through a
JSON validator such as [JSONLint](http://jsonlint.com/) and our source files are run through a
JavaScript validator such as [JSLint](http://www.jslint.com/). Inserting a break into the `styles`
string would create invalid JSON, so we leave the text continuous to be able to use a validator.


## Final note:  basic and advanced configuration are available to you even if ArcGIS.com hosts the application

It is not necessary for you to download the app and to host it on your server unless you want to change
the generic app's HTML or JavaScript:  The entire basic and advanced configuration can be stored in a
web application template in your organization's ArcGIS.com account to drive the behavior of the hosted
application.
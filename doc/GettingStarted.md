# Getting started with configuring the online apps

## I downloaded the app -- now what?

It is ready to run using sample data, so you can set it up on your server to test that it will
work in that environment.  A good starting URL after the appropriate server and site name substitutions
would simply be `http://<yourServer>/<yourSite>/ParcelViewer.html` (for the Parcel Viewer download).
Zoom in a bit and click on a parcel to get its details popup (defined in the sample data's webmap).
Try a search for a parcel (e.g., "1916301027") or an address (e.g., "42757 Woodward Ave").  Change the basemap.
Send the current extents to someone via email.

With familiarity about what the app does, you can see where you want to customize it.  To begin, we need
to understand how to configure the app.

### Two types of configuration

There are two types of configuration that can be done without changing the JavaScript software:

1. Publication configuration:  title, color theme, search layer, etc.
2. Advanced configuration:  icons, menu options, placement & sizing of user interface (UI) elements, etc.

Publication configuration is done as part of publishing a webmap as a web application, and one uses the
ArcGIS Online configuration user interface to perform it.  Normally, just a few items are presented at
this level.

Advanced configuration is available to you to customize the publication configuration, the publication configuration
UI, and the app; one uses a text editor to perform it.  It specifies which UI elements are to appear,
the order in which they are to appear, and the CSS to display them.  There is no need to modify this
part of a web application template in order to use the app -- it is only there to make it easier to modify
the app without touching the JavaScript or to customize the app without having to host it.  For more information
about advanced configuration, see the
[Advanced Configuration document](https://github.com/Esri/local-government-online-apps/blob/master/doc/AdvancedConfiguration.md).

### Elements of the publication configuration

As an example of a publication configuration, we will use the standard Parcel Viewer web app template
from the Solutions set of templates. The Parcel Viewer publication configuration is divided into three sections:
Title, Map, and Help.

The Title section has type-in boxes for the banner title and for the URL to the icon to use for the app
in the banner; the URL can be local (e.g., the default "images/onlineapp.png" points to an image in the
hosting site's "images" folder) or the full URL to an image on another site. The image is scaled to
48 pixels high to fit in the banner; its width is scaled by the same percentage as the
height is scaled, but is not constrained to a fixed width: it is possible to have a rectangular image.
Images may be PNG, GIF, or JPEG.

The Title section also has a color scheme setting; each theme defines a combination of text color,
background color, highlighting color, and alternate background color.

The Map section provides a way to change the webmap for the app, configuration for the app's
searching feature, and basemap group settings.

The Help section provides a way to enter the text that appears when your user clicks the Help icon.

#### Searching settings

Searching has several type-in boxes:

* The hint is the text that appears as a hint in the app's search box.
* The names of one or more layers are provided as the webmap feature layers to search.
Separate multiple names by commas; names are case-sensitive. *Important note: At this
time, the app is not able to get access to layers within other layers. The search layer needs
to be a top-level layer.*
* The names of one or more fields in the feature layers that will be searched whenever your
user enters text into the app's search box. Separate multiple names by commas; names are case-sensitive.
A field name needs to appear in at least one of the search feature layers.
* The name of one field per feature layer that will be used to display search results for that layer.
If a field name is not supplied for a feature layer, then the field in which a match was found will be
displayed. Separate multiple names by commas; names are case-sensitive.

When your user clicks on a search result, the app pans to the location of the result. Once there,
it uses two publication options to know what to do next: should it show a popup about the feature
and to what zoom level should it take the map to make it easier for your user to see the feature?

#### Basemap group settings

One configures the basemap group using two type-in boxes: group name and group owner. The group name
is the name of an arcgis.com group that contains the set of basemaps that you want to offer with this
app; the group owner is the arcgis.com login name of the owner of that group. If these fields are left
blank, then a default set of basemaps is supplied by Esri.

*Important note: The status of the group used to supply basemaps must be "public".*

### How an app's configuration is stored

The online app is designed to be a generic, shared, and reusable set of software that is transformed
into an app using data from a configuration written in JSON.  The configuration has four parts:

* "license":  the license for this open-source software
* "configurationSettings":  the publication configuration user interface
* "values":  the default values for the publication configuration
* "ui":  the advanced configuration

These configuration parameters may be stored in a web application template in ArcGIS Online or in a file
on a server.

When you use the app out of the box, it uses a default configuration completely defined in a file found
in the `apps2` folder. E.g., the ParcelViewer.html app uses the `ParcelViewer.json` file.

For more information about the contents of the configuration parts, see the
[Advanced Configuration document](https://github.com/Esri/local-government-online-apps/blob/master/doc/AdvancedConfiguration.md).

#### Where's the webmap ID stored?

The "values" section of the publication configuration begins with a "webmap" element, which labels the ID of
the webmap to be used by the app.


## Configuration sources

Another way for the app to get the configuration is from an ArcGIS Online web application.  Each web
application has a unique ID, e.g., "a915b6cb73d640b0834ee607b91c8141".  You can have the app use the
configuration from that web application via the URL parameter "appid":
`http://<yourServer>/<yourSite>/ParcelViewer.html?appid=28d43bbf94e4499fbb71e1e19a261d60`

This is the configuration that is used by hosted applications, which would use
`http://www.arcgis.com/apps/Solutions/s2.html?appid=28d43bbf94e4499fbb71e1e19a261d60`
for this app. ("s2.html" is the same as "ParcelViewer.html", but with a generic map as its default
user interface.)

If you want to always have your users use `Color.json` for the advanced configuration, you can change
line 77 (approximately) in `js2\lgonlineStart.js` from

    (new js.LGUIBuilder(window.location.search, null, defaultAppUI)).ready.then(

to

    (new js.LGUIBuilder(window.location.search, "apps2/Color")).ready.then(

This change gives you complete control over where the advanced configuration comes from:  It instructs
the app to use `apps2/Color.json` for the advanced configuration regardless of whether the URL has "app="
or "appid=".  (We removed the default configuration file specification -- the third argument -- from this
example for clarity.)  Note that publication configuration will still come from the appid if it is supplied,
but if you've changed the meaning of "DarkGray" and you deleted Twitter and Facebook from the sharing menu
in your JSON configuration file, then those changes will exist regardless of the advanced configuration in
the web application.  For example, try
`http://<yourServer>/<yourSite>/ParcelViewer.html?appid=28d43bbf94e4499fbb71e1e19a261d60`
again after making this change.


## Question: Why is there s1.html and s2.html, js1 and js2, apps1 and apps2?

The main HTML file has a name that reflects its membership in a series of generic apps rather than a
particular configuration of the apps.  This was done because the actual app is driven by the JSON
configuration:  `s2.html` launched with `apps2\ParcelViewer.json` creates a Parcel Viewer app, but
it can also be launched with your own `HydrantFinder.json`, or `ParkSearch.json`, or....

We've organized the releases into series, with the initial release being series 1. Within a series,
the JSON configuration files will work even as the app software is updated so that we don't
inadvertently break your app configurations or require you to migrate your JSON customizations.
Note that published apps store the URL to their underlying software
so they will continue use the correct series even if we should start a new series.


## Final note:  publication and advanced configurations are available to you even if ArcGIS.com hosts the application

It is not necessary for you to download the app and to host it on your server unless you want to change
the generic app's HTML or JavaScript:  The entire publication and advanced configuration can be stored in a
web application template in your organization's ArcGIS.com account to drive the behavior of the hosted
application.
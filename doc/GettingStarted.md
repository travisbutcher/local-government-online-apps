# Getting started with configuring the online apps

## I downloaded the app--now what?

It is ready to run using sample data, so you can set it up on your server to test that it will
work in that environment.  A good starting URL after the appropriate server and site name substitutions
would simply be `http://<yourServer>/<yourSite>/ParcelViewer.html` (for the Parcel Viewer download).
Zoom in a bit and click on a parcel to get its details popup (defined in the sample data's webmap).
Try a search for a parcel (e.g., "1916301027") or an address (e.g., "42757 Woodward Ave").  Change the basemap.
Send the current extents to someone via email.

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
the app without touching the JavaScript or to customize the app without having to host it.  For more information
about advanced configuration, see the
[Advanced Configuration document](https://github.com/Esri/local-government-online-apps/blob/master/doc/AdvancedConfiguration.md).

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

*Important note: The status of the group used to supply basemaps must be 'public'*

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
in the `apps2` folder. E.g., the ParcelViewer.html app uses the `ParcelViewer.json` file.

For more information about the contents of the configuration parts, see the
[Advanced Configuration document](https://github.com/Esri/local-government-online-apps/blob/master/doc/AdvancedConfiguration.md).

#### Where's the webmap ID stored?

The "values" section of the basic configuration begins with a "webmap" element, which labels the ID of
the webmap to be used by the app.


## Configuration sources

Another way for the app to get the configuration is from an ArcGIS Online web application.  Each web
application has a unique ID, e.g., "a915b6cb73d640b0834ee607b91c8141".  You can have the app use the
configuration from that web application via the URL parameter "appid":
`http://<yourServer>/<yourSite>/ParcelViewer.html?appid=28d43bbf94e4499fbb71e1e19a261d60`

This is the configuration that is used by hosted applications, which would use
`http://www.arcgis.com/apps/Solutions/s2.html?appid=28d43bbf94e4499fbb71e1e19a261d60`
for this app. ("s2.html" is the same as "ParcelViewer.html", but with a generic map as its default user interface.)

If you want to always have your users use `Color.json` for the advanced configuration, you can change
line 61 in `js2\lgonlineStart.js` from

    (new js.LGUIBuilder(window.location.search, null, defaultAppUI)).ready.then(

to

    (new js.LGUIBuilder(window.location.search, "apps2/Color")).ready.then(

This change gives you complete control over where the advanced configuration comes from:  It instructs
the app to use `apps2/Color.json` for the advanced configuration regardless of whether the URL has "app="
or "appid=".  (We also removed the default configuration file specification--the third argument--for
clarity.)  Note that basic configuration will still come from the appid if it is supplied, but if
you've changed the meaning of "DarkGray" and you deleted Twitter and Facebook from the sharing menu in
your JSON configuration file, then those changes will exist regardless of the advanced configuration in
the web application.  For example, try
`http://<yourServer>/<yourSite>/ParcelViewer.html?appid=28d43bbf94e4499fbb71e1e19a261d60`
again after making this change.


## Question:  why is there s1.html and s2.html, js1 and js2, apps1 and apps2?

The main HTML file has a name that reflects its membership in a series of generic apps rather than a
particular configuration of the apps.  This was done because the actual app is driven by the JSON
configuration:  `s2.html` launched with `apps2\ParcelViewer.json` creates a Parcel Viewer app, but
it can also be launched with your own `HydrantFinder.json`, or `ParkSearch.json`, or....

We've organized the releases into series, with the initial release being series 1.  The idea is that,
apart from significant errors or ArcGIS Online hosting rule changes, a series will be left alone once
it is released so that we don't inadvertently break your app configurations or require you to migrate
your JavaScript modifications.  App configurations will be copied into subsequent series and tested
within those environments, so with the next online apps release, the Esri-supplied ParcelViewer web
application template will start using the next series for *new* web applications--already-published
web applications have a URL within them pointing to the series under which they were published and
will not need to be changed.

The download contains a customized HTML filename: instead of having a generic map as its default user interface
should the user interface argument be omitted from the URL, it has a domain-specific default user interface.


## Final note:  basic and advanced configuration are available to you even if ArcGIS.com hosts the application

It is not necessary for you to download the app and to host it on your server unless you want to change
the generic app's HTML or JavaScript:  The entire basic and advanced configuration can be stored in a
web application template in your organization's ArcGIS.com account to drive the behavior of the hosted
application.
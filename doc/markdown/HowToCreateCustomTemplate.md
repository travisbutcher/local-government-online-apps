[publish a web map using a web application template]: http://resources.arcgis.com/en/help/arcgisonline/index.html#/Make_your_first_app/010q000000z3000000/
[web app structure]: images/webappStructure.png "web app structure"
[web map structure]: images/webmapStructure.png "web map structure"
[template structure]: images/templateStructure.png "template structure"
[standard templates]: http://www.arcgis.com/home/gallery.html#c=esri&t=apps&o=modified&f=configurable
[example publication configuration options]: images/publicationConfiguration.png "example publication configuration options"
[JSON]: http://en.wikipedia.org/wiki/JSON
[Configure map viewer description]: http://resources.arcgis.com/en/help/arcgisonline/index.html#/Configure_map_viewer/010q000000mm000000/
[standard Parcel Viewer]: http://arcgis4localgov2.maps.arcgis.com/home/item.html?id=85ec8f162e654968a3740740075b34c6
[ArcGIS Online Parcel Viewer item summary]: images/ParcelViewerItemThumb.png "ArcGIS Online Parcel Viewer item summary"
[web application template's ArcGIS Online id]: images/arcgisItemPageURL.png "web application template's ArcGIS Online id"
[web application template's server URL location]: images/serverURL.png "web application template's server URL location"
[create a custom template]: http://resources.arcgis.com/en/help/arcgisonline/index.html#//010q00000076000000#ESRI_SECTION1_55703F1EE9C845C3B07BBD85221FB074
[http://www.arcgis.com/sharing/content/items/85ec8f162e654968a3740740075b34c6/data?f=pjson]: http://www.arcgis.com/sharing/content/items/85ec8f162e654968a3740740075b34c6/data?f=pjson
[template in ArcGIS Online]: http://www.arcgis.com/sharing/content/items/85ec8f162e654968a3740740075b34c6/data?f=pjson
[ArcGIS Resources]: http://resources.arcgis.com/en/help/arcgisonline/index.html#/Add_configurable_parameters_to_templates/010q000000ns000000/
[JSON.org]: http://www.json.org/
[user interface changed to white on red]: images/ParcelViewerRed.png "user interface changed to white on red"
[user interface changed to black on orange]: images/ParcelViewerOrange.png "user interface changed to black on orange"
[apps2/ParcelViewer.json]: ../../apps2/ParcelViewer.json
[Red.json]: ../examples2/Red.json
[Orange.json]: ../examples2/Orange.json

[app configuration file]: UnderstandingConfigurationFile.md
[apps2/ folder]: ../../apps2/
[Solutions online apps GitHub site]: https://github.com/Esri/local-government-online-apps
[doc/examples2/ folder]: ../examples2/
[nls/ folder]: ../../nls/
[Resources]: Resources.md
[Esri Support]: http://support.esri.com/
[LICENSE.txt]: ../../LICENSE.txt

![](images/configuring.png)

## How to Create a Custom Template

> Configuration hides/exposes/moves existing functionality only and these changes are supported by [Esri Support][].
> Apps with configuration changes may be hosted in ArcGIS Online or on your server.

### Summary

When you [publish a web map using a web application template][]), ArcGIS Online creates an app for you. This app is a go-between that points to your webmap, the web application template that you choose, and some template configuration values (more about this later).

![web app structure][]

The web map is a go-between that points to map data, map services, popups, symbology, etc., to create a map.

![web map structure][]

The web application template is a go-between that points to the web app's software, a publishing configuration user interface (UI), some initial values for that interface, and, for the Solutions set of web apps, the web app's user interface.

![template structure][]

In summary, a web mapping application (WMA) uses three ArcGIS Online items; each item has the usual ArcGIS Online description content plus a data section.  The key WMA item in the description is the URL; the data section is the more interesting part.

1.  web mapping application-ties a template and webmap together and stores some configurations
    1.  description's URL:  points to application's software with a parameter for the WMA's ArcGIS Online ID; e.g.,
    http://arcgis4localgov2.maps.arcgis.com/apps/Solutions/s2.html?appid=b43cec0bd3fe4e4880343122af598e48; this is copied from the template when the WMA is created
    2.  data section:
        1.  ArcGIS Online id of the template that was used to create the WMA
        2.  ArcGIS Online id of the webmap that was used to create the WMA
        3.  WMA-specific overrides to the default values for the publication configuration (By "publication configuration", we're referring to the configuration -- such as title, color, etc. -- that one can do as part of publishing a webmap into a web app)
2.  web mapping application template-defines the publication configuration UI and provides the URL to the underlying software used by the WMA
    1.  description's URL:  points to application's software only; e.g., http://myorg.arcgis.com/apps/Solutions/s2.html?app=apps2/ParcelViewer
    2.  data section:  a JSON structure with 2-4 parts
        1.  "values":  the default values for the publication configuration (quotes are used because that's the JSON format-tag-value pairs, with tags as quoted strings)
        2.  "configuration":  the UI for the publication configuration
        3.  "ui":  the UI for the WMA itself
        4.  "license": the license for the open source software
3.  webmap
    1.  description's URL: not used
    2.  data section:
        1.  "operationalLayers"
        2.  "baseMap"
        3.  "version"


The web app's software is a JavaScript application residing on a server that knows how to work with templates and web maps. For the [standard templates][] that Esri provides in ArcGIS Online such as Basic Viewer, Parcel Viewer, Finder, etc., the software is hosted on the ArcGIS Online server just like the web map and the template.

Each application permits some amount of configuration that is done when you are publishing the web app -- things such as a title, a theme color, a selection of features, and so on.

![example publication configuration options][]

Because a template can be shared by many web apps, your selections during publishing configuration are stored in the web app. (And a web map can be shared among many web apps, too -- web app publication is flexible!)

You can create custom web application templates for your organization and use them the same way as the standard ones. Because the publication configuration user interface and its initial values are defined in the template using [JSON][], you can read and change them.

With the Solutions set of web apps such Parcel Viewer, Finder, et al., you can make much bigger changes, such as make the app search a geocoder with a free-form address in addition to searching the feature layers, or show a splash screen when the app starts up. If the underlying app contains the feature, you can use it in your user interface.

Creating a custom template is easy, but involves a number of steps.

When you publish a webmap as an app, ArcGIS Online offers a gallery of webmap app templates from Esri. In order to add custom templates, you'll create a group to hold them and then adjust your organization's configuration to use that group as your organization's gallery instead of the Esri default gallery. The [Configure map viewer description][] tells you how to do this under its Web App Templates bullet point.

We'll create a custom app template by modifying an existing web app template. We'll use the Parcel Viewer template from the Solutions set of web apps as the starting point, but these instructions work for any of the Esri default web app templates.

* Sign in to your organization's ArcGIS Online account with an administrator's account.

* Find the model web app template's item description in ArcGIS Online.

    * In the search box in the top-right corner, type the title of the model web app template (e.g., "Parcel Viewer") and then click the "Search for Apps" link in the dropdown box below the search box.
    * If the template is not in your organization (e.g., it was published by Esri), uncheck "Only search in <i>username</i>" along the left side of the page to expand and refresh the search.
    * Click on the title of the one that you want; you might find the publisher line "Web Mapping Application by <i>publisher</i>" useful. For example, for the English-language Parcel Viewer published by Esri, the publisher line is "Web Mapping Application by esri_en" and it is located [here][standard Parcel Viewer].

        ![ArcGIS Online Parcel Viewer item summary][]

    * Copy and save
        * the ArcGIS Online id of the template itself; you can get that from the URL of the ArcGIS Online page URL

            ![web application template's ArcGIS Online id][]

        * the URL to the server hosting the application software

            ![web application template's server URL location][]

* Create the custom template item. The general process is described [here][create a custom template]; below are the specific steps for our configuration.

    * Click on the "MY CONTENT" link at the top of the page.
    * Navigate to the folder where you want to create the configured template and click on the "Add Item" link to create a new item. Use the following options:
        * The item is: An application
        * Web Mapping
        * URL: use the URL copied from the Parcel Viewer description (e.g., "/apps/Solutions/s2.html?app=apps2/ParcelViewer"); if the pasted URL is modified by the Add Item box, we'll fix it later
        * Purpose: Configurable
        * API: JavaScript
    * Add the title and tags that you want and click the "ADD ITEM" button.
    * Click on the "EDIT" link after the new item's description page opens.
    * Update title, thumbnail, summary, description, access and use constraints, tags, and credits as you wish.
    * Fix the URL property if it doesn't match what you originally entered into the Add Item box.

* Add the custom template's configuration into the new template's "Configuration Parameters" box.

    * Using another browser tab or window, get the configuration JSON. Use the following URL, but replace the "85ec8f162e654968a3740740075b34c6" part with the ArcGIS Online id that you saved earlier for the model app template [http://www.arcgis.com/sharing/content/items/85ec8f162e654968a3740740075b34c6/data?f=pjson][]
    * Copy the entire contents of the displayed page. This is the configuration information from the esri_en language version of Parcel Viewer, but it is the same for all languages. Language-specific phrases for the app are stored in files with the app's software.
    * Paste the contents into the "Configuration Parameters" box.
    * Click the "Save" button.

* Add the custom template to your custom templates group.

    * Click on the "SHARE" link.
    * Check the box next to the name of your custom templates group.
    * Click the "OK" button.

Now when your users publish a webmap, they will be able to use your custom template. The resulting app should appear and behave the same as your model web app template.

There are a lot of steps, but remember what it gets you: the freedom to configure a hosted app!

The JSON that you copied and pasted into the Configuration Parameters is essentially the same as the JSON that you'll find in the file [apps2/ParcelViewer.json][] in the [Solutions online apps GitHub site][]. (There will be small formatting changes and the hosted version will have a note linking it to the GitHub commit that it came from.)

For the other configuration configuration articles, we'll start with the file version simply because it is easier to manage files. We'll modify it and paste its contents into the template's Configuration Parameters to create an app template.

We'll take the Parcel Viewer template from the Solutions set of web apps and make a small change to see template configuration in action.

#### Change the color offering

As an example configuration, we'll change the color theme of the app.

When you look at the ParcelViewer.json configuration file -- whether it is from a [template in ArcGIS Online][] or from the [file in GitHub][apps2/ParcelViewer.json] -- you'll see that it's a nested structure of tags and values, where values can be quoted text, a number, a structure (a structure is enclosed in braces ("{" to "}")), or an array (enclosed in square brackets ("[" to "]")). [JSON.org][] provides JSON syntax information.

The top level of the configuration file contains four items: "license", "values", "configurationSettings", and "ui". "configurationSettings" and "values" are in every ArcGIS Online web application template: they're the publishing configuration user interface and initial values for that interface, respectively. (See [ArcGIS Resources][] for more about configuration.)  "license" is license text for our open source software. "ui" is the web app's user interface. We'll make a very small change to one of the theme colors offered during publication just to show that we can, indeed, create a configured template.

----------
### Procedure

* Make a copy of apps2/ParcelViewer.json; we'll call it StartWithSplash.json for this exercise, but the name doesn't matter.

* Open StartWithSplash.json in a text editor and search for



* Make a copy of apps2/ParcelViewer.json; we'll call it Red.json for this exercise, but the name doesn't matter.
* Open Red.json in a text editor.
* Find the three places where there is the text "Orange" and change them to "Red". The third location, at about line 166, will be followed by a line that looks like

    ```json
    "colors": ["#fff", "#cd8500", "#ffb122", "#ffb122"]
    ```

The four items inside the square brackets (array) are the foreground color (text), background color, highlight color (for when the cursor is over a command), and alternate background color.

We'll change the background color from "#cd8500" to "darkred" and the highlight color from "#cd8500" to "red". (Note that this set of articles is not about aesthetics.)

```json
"colors": ["#fff", "darkred", "red", "#ffb122"]
```

Copy everything in the text editor and paste it into your custom template's Configuration Parameters. When you publish a map using this custom template and get to the publication configuration, you'll see that one of your color options is "Red" and that it will use the background and highlight colors that we just set up. With this modification, we've changed the publishing user interface as well as the underlying color table used by the app.

![user interface changed to white on red][]

One doesn't have to change the publishing user interface to configure. Perhaps you like having Orange as an option, but want a brighter orange with black text. In this case, you just change the color table definition for Orange from

```json
"theme": "Orange",
"colors": ["#fff", "#cd8500", "#ffb122", "#ffb122"]
```

to, for example,

```json
"theme": "Orange",
"colors": ["black", "#ffa500", "#996300", "#996300"]
```

![user interface changed to black on orange][]

----------
### Related information

All app source code is available from the [Solutions online apps GitHub site][]; this article's template configurations are [Red.json][] and [Orange.json][] in the repository's [doc/examples2/ folder][].

Because it can be very easy to make a small typing error, we strongly recommend "linting" your changed files to validate their syntax. All JavaScript & JSON in the repository is validated except for third-party libraries. Additional information is available on the [Resources][] page.

Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.
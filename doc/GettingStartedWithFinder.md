[overview]: markdown/images/Finder.png "Finder is a configurable web application"
[layers]: markdown/images/TOCLayers.png "Examples of layers that may exist in the web map"

[basemaps]: ../images/basemap.png
[edit]: ../images/markup.png
[find]: ../images/search.png
[help]: ../images/help.png
[share]: ../images/share.png
[print]: ../images/print.png

[bconfig]: markdown/BasicConfigurationOfFinder.md
[How to Host an App on Your Server]: markdown/HowToHostAppOnYourServer.md
[How to Host an App on ArcGIS Online]: markdown/HowToHostAppOnOnline.md
[FAQ]: FAQ.md
[preview]: http://www.arcgis.com/apps/Solutions/s2.html?app=apps2/Finder
[layertypes]: http://resources.arcgis.com/en/help/arcgisonline/index.html#/Add_layers/010q0000009v000000/
[LICENSE.txt]: ../LICENSE.txt

![](markdown/images/gettingStarted.png)

## Getting Started with Finder

Finder (Formerly known as Parcel Viewer) is a configurable application template that searches and queries attributes of feature layers. It can be used to present information about a wide variety of features such as property tax and assessment information or the locations of water access points. The app is responsively designed to support use with desktop browsers, smartphones, and tablet devices.

To get familiar with the functionality of Finder, [preview the application][preview] or copy the downloaded application files to your web server. From your web server, access Finder from a URL similar to *http://yourServer/yourSite/s2.html?app=apps2/Finder*.

![Finder application][overview]

### Using Finder

The basic functions of Finder are the following:

**Map navigation**: Click zoom in (+) or out (-) to adjust the extents of the map. This behavior is also available through the mouse wheel. Home returns the map to the initial extents. Find my location uses the IP address of the computer to zoom to the user's location. The map pans by clicking and dragging the map. Find my location and Home are not available when using Internet Explorer 7 & 8.

![Find][find] **Find**: Compares the search term to the values in a configured list of field and returns the results. Multiple fields from multiple layers may be searched. The field used to display the search results may also be configured.

![Switch basemaps][basemaps] **Switch Basemaps**: The basemaps shown are, by default, the maps in the basemaps group configured in the organization settings. Alternatively, a different group may be specified for this app in the app configuration.

![Share][share] **Share the application**: Send a URL to the application with the current extents using email, Facebook, or Twitter.

![Print][print] **Print the current map**: Creates a pdf file for download showing the current map extents in either landscape or portrait layout. A legend and a scale bar are displayed along the bottom of the map.

![Help][help] **Application help**: Configurable text for end users of the application.

### Requirements

Supported Browsers

- Mozilla Firefox
- Google Chrome
- Apple Safari
- Microsoft Internet Explorer 7/8/9/10
- Google Chrome for Android
- Apple Safari for iOS

The Finder application consumes an ArcGIS Online map containing one or more map layers and a basemap. The layers in the map may be [any type supported by ArcGIS Online maps][layertypes].

The map may contain layers of any origin, but not all map layers can be searched or filtered. Any layer that is not tiled or nested in the map table of contents (1) can be searched and filtered.

Finder cannot be configured to search fields that exist in the following layer types:

- Map service layers that are added without the layer index number specified (2)
- Layers that are nested inside group layers (3)
- Tiled services (4)

![Layer types that can be displayed in Finder. Nested layers (2 and 3) and tiled layers (4) cannot be searched.][layers]

### Implementation Strategies

Once you're familiar with the application, consider how you will want to make it available to your users.

#### Hosting the app

Finder can be hosted

- in your ArcGIS Online organization

    When your users publish a web map using the Finder template, they have the opportunity to configure basic parameters of the app. The application can be shared publicly or with others in your organization.

	[Learn more about hosting an app using ArcGIS Online][How to Host an App on ArcGIS Online]

- on your web server

    You, as the administrator, configure the application using this code that you've downloaded from GitHub. The fully-configured application can then be run from your web server.

	[Learn more about hosting an app on your server][How to Host an App on Your Server]

### Configuring Finder

Two levels of configuration are available whether your app will be hosted using ArcGIS Online or your own web server.

#### Basic configuration

Many aspects of Finder can be configured through the app's configuration panel in ArcGIS Online, including the color scheme, title, and the layers and fields used for searching map content.

[Learn more about configuring Finder][bconfig]

#### Additional configuration

Additional configuration of the application is possible whether the app is hosted in your ArcGIS Online organization or on your server. Default  values, the configuration UI, and the widget bar at the top of the application can all be modified.

[Learn more about additional configuration options][FAQ]

----------
Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.
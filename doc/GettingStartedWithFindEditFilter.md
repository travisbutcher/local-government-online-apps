[overview]: markdown/images/FindEditFilter.png "Find, Edit, and Filter is a configurable web application"
[layers]: markdown/images/TOCLayers.png "Examples of layers that may exist in the web map"

[basemaps]: ../images/basemap.png
[edit]: ../images/markup.png
[find]: ../images/search.png
[help]: ../images/help.png
[share]: ../images/share.png
[print]: ../images/print.png

[bconfig]: markdown/BasicConfigurationOfFindEditFilter.md
[How to Host an App on Your Server]: markdown/HowToHostAppOnYourServer.md
[FAQ]: FAQ.md
[preview]: http://www.arcgis.com/apps/Solutions/s2.html?app=apps2/FindEditFilter
[layertypes]: http://resources.arcgis.com/en/help/arcgisonline/index.html#/Add_layers/010q0000009v000000/
[LICENSE.txt]: ../LICENSE.txt

![](markdown/images/gettingStarted.png)

## Getting Started with Find, Edit, and Filter

Find, Edit, and Filter is a configurable application template that can be used to search, edit, attribute, and filter map content. A field can be defined to populate with a default attribute during editing workflows. This field is also used to filter visible map content. Editing can be disabled for some or all layers by modifying the map layer settings. Layers with editing disabled can still be searched and filtered using the application.

To get familiar with the functionality of Find, Edit, and Filter, [preview the application][preview] or copy the downloaded application files to your web server. From your web server, access Find, Edit, and Filter from a URL similar to *http://yourServer/yourSite/s2.html?app=apps2/FindEditFilter*.

![Find, Edit and Filter application][overview]

### Using Find, Edit, and Filter

The basic functions of Find, Edit, and Filter are the following:

**Map navigation**: Click zoom in (+) or out (-) to adjust the extents of the map. This behavior is also available through the mouse wheel. **Home** returns the map to the initial extents. **Find my location** uses the IP address of the computer to zoom to the user’s location. The map pans by clicking and dragging the map. **Find my location** and **Home** are not available when using Internet Explorer 8.

![Find][find] **Find**: Compares the search term to the values in a configured list of field and returns the results. Multiple fields from multiple layers may be searched. The field used to display the search results may also be configured.

![Edit and Filter][edit] **Edit/Filter**: With the editing palette open, existing the geometry and attributes of editable features may be modified in the map. New features are created by choosing a template and drawing the feature on the map. If a filter value has been applied and the new feature contains the configured filter field, the current filter value will be applied to the new feature.

![Switch basemaps][basemaps] **Switch Basemaps**: The basemaps shown are, by default, the maps in the basemaps group configured in the organization settings. Alternatively, a different group may be specified for this app in the app configuration.

![Share][share] **Share the application**: Send a URL to the application with the current extents using email, Facebook, or Twitter.

![Help][help] **Application help**: Configurable text for end users of the application.

### Requirements

Supported Browsers

- Mozilla Firefox
- Google Chrome
- Apple Safari
- Microsoft Internet Explorer 8/9/10

The Find, Edit, and Filter application consumes an ArcGIS Online map containing one or more map layers and a basemap. The layers in the map may be [any type supported by ArcGIS Online maps][layertypes].

The map may contain layers of any origin, but not all map layers can be searched or filtered. Any layer that is not tiled or nested in the map table of contents (1) can be searched and filtered.

Find, Edit, and Filter cannot be configured to search or filter using fields that exist in the following layer types:

- Map service layers that are added without the layer index number specified (2)
- Layers that are nested inside group layers (3)
- Tiled services (4)

![Layer types that can be displayed in Find Edit. Nested layers (2 and 3) and tiled layers (4) cannot be searched.][layers]

### Implementation Strategies

Once you're familiar with the application, consider how you will want to make it available to your users.

#### Hosting the app

Find, Edit, and Filter can be hosted

- in your ArcGIS Online organization

    When your users publish a web map using the Find, Edit, and Filter template, they have the opportunity to configure basic parameters of the app. The application can be shared publicly or with others in your organization.

- on your web server

    You as the administrator configure the basic parameters using this code that you've downloaded from GitHub. The fully-configured application can then be run from your web server.

For additional information, see [Basic Configuration of Find, Edit, and Filter][bconfig] and [How to Host an App on Your Server][].

#### Customizing the app

Additional configuration of the application is possible whether the app is hosted in your ArcGIS Online organization or on your server. Default values, the configuration UI, and the widget bar at the top of the application can all be modified.

See [FAQ][] for more information about this level of customization.

----------
Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.

[agol]: http://www.arcgis.com
[maptoapp]: http://resources.arcgis.com/en/help/arcgisonline/index.html#/Create_apps_from_maps/010q0000008t000000/
[LICENSE.txt]: ../../LICENSE.txt

![](images/gettingStarted.png)

## Basic Configuration of Finder

Finder can be configured in [ArcGIS Online][agol] using the UI configuration experience available when [publishing a map as a web app][maptoapp]. This level of configuration does not require downloading the app code and exposes the following parameters:

**Title**: This title is displayed at the top of the application and is included with the URL when sharing the application through the Share widget.

**Icon URL**:  The URL to a 48px tall image to display in the upper left corner of the application. The URL can be local (e.g., the default "images/onlineapp.png" points to an image in the hosting site's "images" folder) or the full URL to an image on another site. The image is scaled to 48 pixels high to fit in the banner; its width is scaled by the same ratio as the height is scaled, but is not constrained to a fixed width: it is possible to have a rectangular image. Images may be PNG, GIF, or JPEG.

**Color Scheme**: The color of the application title bar, message windows, and widget panels.

**Web Map**: The web map displayed in the application.

**Basemap Group**: Maps from the organizations basemap group (set in the organization settings) are displayed by default in the Switch Basemaps widget. A different group can be specified by providing the group name and username of the group owner. This group should be shared with, at minimum, the entire audience of the application. For example, if the application is only shared with a group, the basemaps may be shared publicly, with the organization, or with only that group. If the application will be publicly accessible, the basemaps and basemap group must also be publicly visible.

**Hint**: Search hint message displayed in the search text box.

**Find Fields and Layers**: These parameters accept a comma-separated list of field names (not aliases), and map layer names, respectively. One or many values may be specified and the fields and layers may be listed in any order. The application will search any field with a listed name that occurs in a listed layer. One result will be returned for each occurrence of the search term.

**Result Display Field**: If this field exists in a layer where a search result was found, the value from this field will appear in the search results list. If this field doesn’t exist in the layer where a result was found, the value of the searched field will be displayed in the search results list. The Result Display Fields must be listed in the same order as the Find Layers to which they apply. Only one Result Display Field can be defined for each Find Layer.

For example, the searched field may contain Parcel IDs, but the addresses of the matching parcel IDs could be displayed in the search results list if the Results Display Field is set to the field containing the addresses of each parcel.

**Zoom Level**: The zoom level the map moves to when displaying a selected search result.

**Show Popup for Selected Feature**: When this option is enabled, a popup window will open automatically for selected search results. When this option is disable, the application will still zoom to the feature, but the feature will need to be clicked to view the popup window.

**Help Text**: Text to display in the Help widget.

----------
Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.
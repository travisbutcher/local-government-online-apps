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

## How to Modify the Default Configuration Values for Finder

> Configuration hides/exposes/moves existing functionality only and these changes are supported by [Esri Support][].
> Apps with configuration changes may be hosted in ArcGIS Online or on your server.

### Summary

We will modify an [app configuration file][] in the repository and use its contents to [create a custom template][]. Any of the app configuration files in the repository's [apps2/ folder] can be used as a starting point.

The default values displayed in the configuration panel are set in the “values” section at the top of the configuration file, or if the app is to be hosted (either on ArcGIS Online or a web server) fully configured, these are the settings the app will use.

----------
### Parameters

Each of the following rows corresponds to one of the parameters displayed in the configuration panel. Each row is also a line in the Finder configuration file.

Change several of these values, then save and lint the configuration file. Copy the configuration file contents into a new custom template's Configuration Parameters. Publish a map, and you'll see the new default values in the configuration panel.

<table style="width:300px">
<tr>
  <th>Basic Configuration</th>
  <th>Advanced Configuration</th>
  <th>Default Value</th>
</tr>
<tr>
  <td>Web Map</td>
  <td>"webmap"</td>
  <td>"d3df161ab8204e848b359d5f352b5b65"</td>
</tr>
<tr>
<td>Title</td>
<td>"titleBar.title"</td>
<td>"Finder"</td>
</tr>
<tr>
<td>Icon URL</td>
<td>"titleBar.iconUrl"</td>
<td>"images/onlineapp.png"</td>
</tr>
<tr>
<td>Color Scheme</td>
<td>"colorizer.theme"</td>
<td>"DarkGray"</td>
</tr>
<tr>
<td>Find Hint</td>
<td>"searchBox.hint"</td>
<td>""</td>
</tr>
<tr>
<td>Find Layers</td>
<td>"featureSearcher.searchLayerName"</td>
<td>""</td>
</tr>
<tr>
<td>Find Fields</td>
<td>"featureSearcher.searchFields"</td>
<td>""</td>
</tr>
<tr>
<td>Result Display Field</td>
<td>"featureSearcher.displayFields"</td>
<td>""</td>
</tr>
<tr>
<td>Show Popup for Selected Feature</td>
<td>"highlighter.showFeaturePopup"</td>
<td>True</td>
</tr>
<tr>
<td>Zoom Level</td>
<td>"highlighter.highlightZoomLevel"</td>
<td>16</td>
</tr>
<tr>
<td>Alternate Basemap Group</td>
<td>"basemapBox.basemapgroupTitle"</td>
<td>""</td>
</tr>
<tr>
<td>Basemap Group Owner</td>
<td>"basemapBox.basemapgroupOwner"</td>
<td>""</td>
</tr>
<tr>
<td>Help Text</td>
<td>"helpMessageBox.content"</td>
<td></td>
</tr>
</table>



----------
### Related information

All app source code is available from the [Solutions online apps GitHub site][].

Because it can be very easy to make a small typing error, we strongly recommend "linting" your changed files to validate their syntax. All JavaScript & JSON in the repository is validated except for third-party libraries. Additional information is available on the [Resources][] page.

Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.
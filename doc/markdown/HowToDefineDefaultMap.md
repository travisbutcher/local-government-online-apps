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

## How to Define a Default Map

> Configuration hides/exposes/moves existing functionality only and these changes are supported by [Esri Support][].
> Apps with configuration changes may be hosted in ArcGIS Online or on your server.

### Summary

We will modify an [app configuration file][] in the repository and use its contents to [create a custom template][]. Any of the app configuration files in the repository's [apps2/ folder] can be used as a starting point.

The default map displayed in the app can be defined in the configuration file.

----------
### Procedure

* Make a copy of apps2/ParcelViewer.json; we'll call it NewWebMap.json for this exercise, but the name doesn't matter.

* Open NewWebMap.json in a text editor and search for

        "webmap": "796c572e6dcb4c88b77c024ae003bd88",

* In a web browser, browse to the web map you'd like to display as the default map.
* Copy the map ID (GUID) from the end of the map URL.
* Paste this GUID into the webmap parameter.

* Save and lint NewWebMap.json; copy its contents into a new custom template's Configuration Parameters. Access the application from its default URL and see the new default web map displayed.

----------
### Related information

All app source code is available from the [Solutions online apps GitHub site][].

Because it can be very easy to make a small typing error, we strongly recommend "linting" your changed files to validate their syntax. All JavaScript & JSON in the repository is validated except for third-party libraries. Additional information is available on the [Resources][] page.

Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.
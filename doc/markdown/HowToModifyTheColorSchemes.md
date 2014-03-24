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

## How to Modify the Available Color Schemes

> Configuration hides/exposes/moves existing functionality only and these changes are supported by [Esri Support][].
> Apps with configuration changes may be hosted in ArcGIS Online or on your server.

### Summary

We will modify an [app configuration file][] in the repository and use its contents to [create a custom template][]. Any of the app configuration files in the repository's [apps2/ folder] can be used as a starting point.

For this article, our change modifies the definition of the 'Dark Gray' color scheme.


----------
### Procedure

* Make a copy of apps2/ParcelViewer.json; we'll call it ColorScheme.json for this exercise, but the name doesn't matter.

* Open ColorScheme.json in a text editor and search for

		"colors": ["#fff", "#333333", "#5d5d5d", "#5d5d5d"]

	These values control the following aspects of the app color scheme:

	- foreground color: #fff
	- background color: #333333
	- highlight color: #5d5d5d
	- alternate background color: #5d5d5d

* Change these values to

		"colors": ["#fff", "#555", "#888", "#888"]

	These values control the following aspects of the app color scheme:

	- foreground color: #fff
	- background color: #555
	- highlight color: #888
	- alternate background color: #888

	Colors may be defined using the normal CSS styles: text (case-insensitive, e.g., "white") or hexadecimal form (e.g., "#9400d3"). The hexadecimal form may be shortened to three digits (e.g., "#f80"), which is automatically extended to six digits ("#ff8800"). Some color names are listed here, with background about how the hexadecimal digits define a color provided here.

* Save and lint ColorScheme.json; copy its contents into a new custom template's Configuration Parameters. Publish a map, and you'll see the app uses the updated color scheme. Add or remove values from this list to add or remove values from the drop-down menu in the configuration panel.

----------
### Related information

All app source code is available from the [Solutions online apps GitHub site][].

Because it can be very easy to make a small typing error, we strongly recommend "linting" your changed files to validate their syntax. All JavaScript & JSON in the repository is validated except for third-party libraries and the computer-generated language-specific phrase files in the [nls/ folder][]. Additional information is available on the [Resources][] page.

Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.
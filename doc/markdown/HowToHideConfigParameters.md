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

## How to Hide Parameters in the Configuration Panel

> Configuration hides/exposes/moves existing functionality only and these changes are supported by [Esri Support][].
> Apps with configuration changes may be hosted in ArcGIS Online or on your server.

### Summary

We will modify an [app configuration file][] in the repository and use its contents to [create a custom template][]. Any of the app configuration files in the repository's [apps2/ folder] can be used as a starting point.

Give your users a simplified configuration experience or  restrict which configuration parameters they can modify by removing unwanted configuration parameters from the configuration panel UI and defining define the values for these parameters in the configuration file.

For this article, our change removes the option to change the icon in the app header from the UI configuration experience.

----------
### Procedure

* Make a copy of apps2/ParcelViewer.json; we'll call it RemoveIcon.json for this exercise, but the name doesn't matter.

* Open RemoveIcon.json in a text editor and search for the icon parameter settings:

        {
            "label": "Icon URL",
            "fieldName": "titleBar.iconUrl",
            "type": "string",
            "tooltip": "Icon in top left corner of application. Icon should be 48px high."
        },

* Delete this section from the configuration file to remove the parameter.
* The application expects an icon to display in the header, so the URL to a graphic must be defined in the "values" section of the RemoveIcon.json file:

        "titleBar.iconUrl": "images/onlineapp.png",

* Save and lint RemoveIcon.json; copy its contents into a new custom template's Configuration Parameters. Access the application from its default URL. The Icon URL should be removed from the configuration panel and the graphic you defined should appear in the application header.

----------
### Related information

All app source code is available from the [Solutions online apps GitHub site][].

Because it can be very easy to make a small typing error, we strongly recommend "linting" your changed files to validate their syntax. All JavaScript & JSON in the repository is validated except for third-party libraries. Additional information is available on the [Resources][] page.

Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.
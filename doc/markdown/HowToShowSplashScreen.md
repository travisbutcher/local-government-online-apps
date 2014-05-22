[sample help display]: images/ParcelViewerHelp.png "sample help display"
[StartWithSplash.json]: ../examples2/StartWithSplash.json

[app configuration file]: UnderstandingConfigurationFile.md
[create a custom template]: HowToCreateCustomTemplate.md
[apps2/ folder]: ../../apps2/
[Solutions online apps GitHub site]: https://github.com/Esri/local-government-online-apps
[doc/examples2/ folder]: ../examples2/
[Resources]: Resources.md
[Esri Support]: http://support.esri.com/
[LICENSE.txt]: ../../LICENSE.txt

![](images/configuring.png)

## How to Show a Splash Screen

> Configuration hides/exposes/moves existing functionality only and these changes are supported by [Esri Support][].
> Apps with configuration changes may be hosted in ArcGIS Online or on your server.

### Summary

We will modify an [app configuration file][] in the repository and use its contents to [create a custom template][]. Any of the app configuration files in the repository's [apps2/ folder] can be used as a starting point.

For this article, our change shows the help display when the app starts up. The help display is the box that appears when one clicks on the question mark icon in the upper-right corner of the app; it contains the text that the web app publisher set up during publication configuration.

![sample help display]

There is a component called "js.LGCallMethods" in the web app's JavaScript library that is able to trigger actions on other components while it is being created. It's not used in the standard configuration files because it's not needed, but it is just what we want for our splash screen: We'll use it to tell the display component that contains the help text to become visible.

----------
### Procedure

* Make a copy of apps2/ParcelViewer.json; we'll call it StartWithSplash.json for this exercise, but the name doesn't matter.

* Open StartWithSplash.json in a text editor and search for the name of the JavaScript class that holds the help text:

    ```json
    "classname": "js.LGMessageBox"
    ```

* Copy the "rootId" configuration parameter of this component; the rootId is a name that you can give to a component so that it can be referenced by other components. In the standard ParcelViewer.json, this component is named "helpMessageBox".

* At the end of StartWithSplash.json, you'll see that the three characters in the last two lines  mark the end of the last component description ("}"), the end of the "ui" list of components ("]"), and the end of the whole file's JSON structure ("}"), respectively.

    ```json
        }]
    }
    ```

* Change the last two lines to the following lines, which places a js.LGCallMethods component as the last component in the "ui" list of components.

    ```json
        }, {
            "classname": "js.LGCallMethods",
            "config": {
                "todo": [
                    {"rootId": "helpMessageBox", "method": "setIsVisible", "arg": "true"}
                ]
            }
        }]
    }
    ```

* Save and lint StartWithSplash.json; copy its contents into a new custom template's Configuration Parameters. Publish a map, and you'll see the help display appear as soon as the web app starts.

#### What is the "config" part of js.LGCallMethods?

For its configuration, js.LGCallMethods takes a "todo" list. Each element of the list consists of a JSON structure with two or three elements:

* **rootId** is the name of the component that js.LGCallMethods is going to ask to act.
* **method** is the name of the method (function) of that component that will perform the action.
* **arg** is an optional argument to send to that method.

What we've done is to have js.LGCallMethods tell component "helpMessageBox" to run method "setIsVisible" with the argument "true" -- in other words, to make itself visible. This will occur when the script player creates the js.LGCallMethods component.

----------
### Related information

All app source code is available from the [Solutions online apps GitHub site][]; this article's template configuration is [StartWithSplash.json][] in the repository's [doc/examples2/ folder][].

Because it can be very easy to make a small typing error, we strongly recommend "linting" your changed files to validate their syntax. All JavaScript & JSON in the repository is validated except for third-party libraries. Additional information is available on the [Resources][] page.

Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.
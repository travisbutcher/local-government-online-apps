[how the project is organized]: HowProjectIsOrganized.md
[master branch of the repository]: https://github.com/Esri/local-government-online-apps/archive/master.zip
[Atlassian]: https://www.atlassian.com/git/workflows#!workflow-gitflow
[nvie.com]: http://nvie.com/posts/a-successful-git-branching-model/
[alternate proxy program]: https://github.com/esri/resource-proxy
[default map]: images/defaultMap.png "default map"
[default Finder map]: images/defaultFinderMap.png "default Finder"
[apps2/ folder]: ../../apps2/
[Using the proxy]: https://developers.arcgis.com/javascript/jshelp/ags_proxy.html

[Solutions online apps GitHub site]: https://github.com/Esri/local-government-online-apps
[Resources]: Resources.md
[LICENSE.txt]: ../../LICENSE.txt

![](images/gettingStarted.png)

## How to Host an App on Your Server

### Summary

Whether you are choosing to deploy these apps on your own server or are just using your server to develop and test app configuration changes before installing them in your ArcGIS Online organization, these instructions show you how to set up the project on your server.

These instructions assume that you have a Web server like Internet Information Services (IIS) installed and setup on your machine. If you are using another Web server, the general installation steps will be the same but you will need to check your Web server's documentation for specific information on deploying and testing the application, and you will need to provide an [alternate proxy program][].

----------
### Procedure

* Download the [master branch of the repository][] from the [Solutions online apps GitHub site][]; this is the one that you'll be directed to when you choose the "Download" option during web map publishing.

    > The repository uses the git workflow described by [Atlassian][] and [nvie.com][]: "The master branch stores the official release history, and the develop branch serves as an integration branch for features" (Atlassian). Feature-specific branches are used to develop and test new work before it is merged into the develop branch. See [how the project is organized][] for more information about the repository.

* Copy the contents of the zip file into your web server's root directory. In IIS, the default location for the web server's root folder is C:\inetpub\wwwroot. You may need to setup and use a proxy page to support sharing and secure services. View the [Using the proxy][] page help topic for details on installing and configuring a proxy page. Rename the site if desired; we'll use `<yourSite>` in this article.

* Try the URL `http://<yourServer>/<yourSite>/s2.html` with the appropriate substitutions to test the installation; you should see a general map like this:

    ![default map][]

* Try the URL `http://<yourServer>/<yourSite>/s2.html?app=apps2/Finder` with the appropriate substitutions; you should see a general map like this:

    ![default Finder map][]

What you've done is run one of the app user interface configurations provided in the repository's [apps2/ folder][]. This project is a general mapping project that relies on a user-interface configuration to determine what features to activate for the app user.

When one is using the app in ArcGIS Online, ArcGIS Online hosts the project and the user-interface configuration -- the same as what you see in the apps2/ files -- is stored in an ArcGIS Online template. When one publishes a web map as a web app, that template is used to provide the user interface.

If your site needs a proxy, the one that comes with the project will likely be sufficient after you have converted the site to an IIS "application".

At this point, you are done with the setup and are ready to configure the app by editing the appropriate JSON file in the [apps2/ folder][].

----------
### Related information

All app source code is available from the [Solutions online apps GitHub site][].

Additional information is available on the [Resources][] page.

Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.
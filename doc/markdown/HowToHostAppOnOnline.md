[ArcGIS Online Parcel Viewer item summary]: images/ParcelViewerItemThumb.png "ArcGIS Online Parcel Viewer item summary"
[web application template's ArcGIS Online id]: images/arcgisItemPageURL.png "web application template's ArcGIS Online id"
[web application template's server URL location]: images/serverURL.png "web application template's server URL location"
[create a custom template]: http://resources.arcgis.com/en/help/arcgisonline/index.html#//010q00000076000000#ESRI_SECTION1_55703F1EE9C845C3B07BBD85221FB074

[Share]: http://doc.arcgis.com/en/arcgis-online/share-maps/share-items.htm#ESRI_SECTION1_0CF790E7414B48BEB0E69484A76D6A03
[create a new group]:http://doc.arcgis.com/en/arcgis-online/share-maps/create-groups.htm

[app configuration file]: UnderstandingConfigurationFile.md
[customapps]: HowToCreateCustomTemplate.md
[Solutions online apps GitHub site]: https://github.com/Esri/local-government-online-apps
[Resources]: Resources.md
[Esri Support]: http://support.esri.com/
[LICENSE.txt]: ../../LICENSE.txt

![](images/configuring.png)

## How to host an app on ArcGIS Online

ArcGIS Online can host your configured local government application - even if you've made modifications to the JSON configuration file. Once the modified app is hosted, you can make this template part of your template gallery where other members of the organization can use it to create their own applications.

These steps describe the process for hosting a modified version of an existing configurable ArcGIS Online web mapping application template, such as Finder.

[Learn more about creating custom apps][customapps]

### Locate the existing app template
Your configuration will be applied to an existing template, and the new application item you will create must reference the location of the existing application code.

1. Sign in to your ArcGIS Online organization with an administrative account.

2. In the search box in the top-right corner, type the title of the model web app template (e.g., "Finder") and then click the "Search for Apps" link in the dropdown menu below the search box.

3. If the template is not in your organization (e.g., it was published by Esri), uncheck "Only search in <i>organization name</i>" along the left side of the page to expand and refresh the search.

4. Click the title of the app you've configured to open the Details page. The publisher line "Web Mapping Application by <i>publisher</i>" may be useful for finding the correct template. For example, English-language apps published by Esri have the by-line "Web Mapping Application by esri_en".

	![ArcGIS Online Parcel Viewer item summary][]

5. Copy and save the URL to the server hosting the application template.

	![web application template's server URL location][]

### Create a new app item

The general process for adding a new application item to ArcGIS Online is described [here][create a custom template]; below are the specific steps for adding and re-configuring a local government app.

1. In ArcGIS Online, click the "MY CONTENT" link at the top of the page.

2. Navigate to the folder where you want to create the configured template

3. Click on the "Add Item" link to create a new item. Configure the item using the following options:
    * The item is: An application
    * Web Mapping
    * URL: use the URL copied from the application description previously (e.g., "/apps/Solutions/s2.html?app=apps2/Finder"). If the pasted URL is modified by the Add Item box, we'll fix it later.
    * Purpose: Configurable
    * API: JavaScript

4. Add a title and tags and click the "ADD ITEM" button to open the Details page for the new web app template.

5. Click the "EDIT" link and update title, thumbnail, summary, description, access and use constraints, tags, and credits as you wish.

6. Fix the URL property if it doesn't match what you originally entered into the Add Item box.

7. Copy the contents of your modified configuration file into the "Configuration Parameters" text box.

8. Click the "Save" button.

### Add the template to your template gallery

1. At the top of the ArcGIS Online page, click the "MY ORGANIZATION" link.

3. Click "EDIT SETTINGS" and open the "Map" tab.

4. If the group currently selected in the Web App Templates section is Esri Default, [create a new group][] and choose that group from this drop-down menu.

5. [Share][] your new application item with your organization's Web App Templates group.

Now when your users publish a webmap, they will be able to use your custom template. The resulting app should appear and behave the same as your model web app template.

----------
### Related information

All app source code is available from the [Solutions online apps GitHub site][].

Additional information is available on the [Resources][] page.

Copyright 2013 Esri. Licensed under the Apache License, Version 2.0; a copy of the license is available in the repository's [LICENSE.txt][] file.
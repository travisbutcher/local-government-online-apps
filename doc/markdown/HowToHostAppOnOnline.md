[publish a web map using a web application template]: http://resources.arcgis.com/en/help/arcgisonline/index.html#/Make_your_first_app/010q000000z3000000/
[web app structure]: images/webappStructure.png "web app structure"
[web map structure]: images/webmapStructure.png "web map structure"
[template structure]: images/templateStructure.png "template structure"
[standard templates]: http://www.arcgis.com/home/gallery.html#c=esri&t=apps&o=modified&f=configurable
[example publication configuration options]: images/publicationConfiguration.png "example publication configuration options"
[JSON]: http://en.wikipedia.org/wiki/JSON
[Configure map viewer description]: http://resources.arcgis.com/en/help/arcgisonline/index.html#/Configure_map_viewer/010q000000mm000000/
[standard Parcel Viewer]: http://arcgis4localgov2.maps.arcgis.com/home/item.html?id=85ec8f162e654968a3740740075b34c6
[ArcGIS Online Parcel Viewer item summary]: images/ParcelViewerItemThumb.png "ArcGIS Online Parcel Viewer item summary"
[web application template's ArcGIS Online id]: images/arcgisItemPageURL.png "web application template's ArcGIS Online id"
[web application template's server URL location]: images/serverURL.png "web application template's server URL location"
[create a custom template]: http://resources.arcgis.com/en/help/arcgisonline/index.html#//010q00000076000000#ESRI_SECTION1_55703F1EE9C845C3B07BBD85221FB074
[http://www.arcgis.com/sharing/content/items/85ec8f162e654968a3740740075b34c6/data?f=pjson]: http://www.arcgis.com/sharing/content/items/85ec8f162e654968a3740740075b34c6/data?f=pjson
[template in ArcGIS Online]: http://www.arcgis.com/sharing/content/items/85ec8f162e654968a3740740075b34c6/data?f=pjson
[ArcGIS Resources]: http://resources.arcgis.com/en/help/arcgisonline/index.html#/Add_configurable_parameters_to_templates/010q000000ns000000/
[JSON.org]: http://www.json.org/
[Share]: http://doc.arcgis.com/en/arcgis-online/share-maps/share-items.htm#ESRI_SECTION1_0CF790E7414B48BEB0E69484A76D6A03
[create a new group]:http://doc.arcgis.com/en/arcgis-online/share-maps/create-groups.htm

[user interface changed to white on red]: images/ParcelViewerRed.png "user interface changed to white on red"
[user interface changed to black on orange]: images/ParcelViewerOrange.png "user interface changed to black on orange"
[apps2/ParcelViewer.json]: ../../apps2/ParcelViewer.json
[Red.json]: ../examples2/Red.json
[Orange.json]: ../examples2/Orange.json

[app configuration file]: UnderstandingConfigurationFile.md
[apps2/ folder]: ../../apps2/
[Solutions online apps GitHub site]: https://github.com/Esri/local-government-online-apps
[doc/examples2/ folder]: ../examples2/
[nls/ folder]: ../../nls/
[Resources]: Resources.md
[Esri Support]: http://support.esri.com/
[LICENSE.txt]: ../../LICENSE.txt

![](images/configuring.png)

## How to host an app using ArcGIS Online

ArcGIS Online can host your configured local government application - even if you've made modifications to the json configuration file. Once the modified app is hosted, you can make this template part of your template gallery where other members of the organization can use it to create their own applications.

These steps describe the process for hosting a modified version of an existing configurable ArcGIS Online wep mapping application template, such as Finder.

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

* Navigate to the folder where you want to create the configured template

* Click on the "Add Item" link to create a new item. Configure the item using the following options:
    * The item is: An application
    * Web Mapping
    * URL: use the URL copied from the application description previously (e.g., "/apps/Solutions/s2.html?app=apps2/Finder"). If the pasted URL is modified by the Add Item box, we'll fix it later.
    * Purpose: Configurable
    * API: JavaScript

* Add a title and tags and click the "ADD ITEM" button to open the Details page for the new web app template.

* Click the "EDIT" link and update title, thumbnail, summary, description, access and use constraints, tags, and credits as you wish.

* Fix the URL property if it doesn't match what you originally entered into the Add Item box.

* Copy the contents of your modified configuration file into the "Configuration Parameters" text box.

* Click the "Save" button.

### Add the template to your template gallery

1. At the top of the ArcGIS Online page, click the "MY ORGANIZATION" link.
 
3. Click "EDIT SETTINGS" and open the "Map" tab.
 
4. If the group currently selected in the Web App Templates section is Esri Default, [create a new group][] and choose that group from this drop-down menu.

5. [Share][] your new application item with your organization's Web App Templates group.

Now when your users publish a webmap, they will be able to use your custom template. The resulting app should appear and behave the same as your model web app template.
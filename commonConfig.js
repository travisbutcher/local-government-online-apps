/*global define,location,commonConfig:true */
/*jslint sloppy:true */
/** @license
 | Version 10.2
 | Copyright 2013 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define([], function () {
    var config = {
        // sharingUrl: "http://www.arcgis.com",  // URL to sharing service; default is arcgis.com with app's HTTP protocol
        // proxy: null,  // URL to proxy (if desired); default is no proxy
        bingMapsKey: "",
        helperServices: {
            geometry: {
                url: location.protocol + "//utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
            },
            printTask: {
                url: location.protocol + "//utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
            },
            geocode: {
                url: location.protocol + "//geocode.arcgis.com/arcgis/rest/servcies/World/GeocodeServer"
            }
        }
    };

    commonConfig = config;

    return config;
});

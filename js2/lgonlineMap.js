/*global define,dojo,js,window,esri */
/*jslint sloppy:true */
/*
 | Copyright 2012 Esri
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
//============================================================================================================================//
define("js/lgonlineMap", ["dojo/_base/array", "esri/arcgis/utils", "dojo/topic", "dojo/_base/Color", "js/lgonlineBase"], function (array, utils, topic, Color) {

    //========================================================================================================================//

    dojo.declare("js.LGMapDependency", js.LGDependency, {
        /**
         * Constructs an LGMapDependency.
         *
         * @class
         * @name js.LGMapDependency
         * @extends js.LGDependency
         * @classdesc
         * Provides a mixin for handling a ready dependency on a map
         * object.
         */

        /**
         * Performs class-specific setup before waiting for a
         * dependency.
         * @memberOf js.LGMapDependency#
         * @param {object} dependsOn LG object that this object depends
         *        on
         * @override
         */
        onDependencyPrep: function (dependsOn) {
            this.mapObj = dependsOn;
            this.inherited(arguments);
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGMap", js.LGGraphic, {
        /**
         * Constructs an LGMap.
         * <br><b>N.B.: this implementation does not support more
         * than one map per app.</b>
         * <br>All four extents parameters must be supplied in order for
         * extents to be modified; otherwise, web map's extents are
         * used.
         * <br>Listens for "position" messages of the form
         * {latitude:<number>, longitude:<number>}, recenters the map to
         * that position, and displays a location indicator at the
         * position (indicator currently hardcoded to
         * "images/youAreHere.png").
         *
         * @param {object} [args.parentDiv] Name of DOM
         *        object into which the object's div is to be placed;
         *        required for subsequent searching for this object by
         *        id (LGObject)
         * @param {string} args.rootId Id for root div of created object
         *        (LGObject)
         * @param {string} [args.rootClass] Name of CSS class to
         *        use for the root container of the object (LGObject)
         * @param {boolean} [args.fill=false] Whether the object should
         *        fill its parent's div or not; if fill is true, the
         *        horizOffset and vertOffset parameters are ignored
         *        (LGGraphic)
         * @param {number} [args.horizOffset] Horizontal offset
         *        flag/value: >0: left side; 0: center; <0: right side;
         *        undefined: no horizontal or vertical adjustment
         *        (LGGraphic)
         * @param {number} [args.vertOffset] Vertical offset
         *        flag/value: >0: top side; 0: center; <0: bottom side;
         *        undefined: no horizontal or vertical adjustment
         *        (LGGraphic)
         *
         * @param {object} [args.mapOptions] Options to be sent to
         *        created map; see
         *        <a
         *        href="http://help.arcgis.com/en/webapi/javascript/arcgis/jsapi/map.html#MapConst">API
         *        for JavaScript map constructor</a>
         *
         * @param {object} args.values Key-value pairs for configurable
         *        elements (LGGraphic)
         * @param {string} args.values.webmap ArcGIS.com id of web map
         *        to display
         * @param {string|number} [args.values.xmin] Westernmost map
         *        extent
         * @param {string|number} [args.values.ymin] Southernmost map
         *        extent
         * @param {string|number} [args.values.xmax] Easternmost map
         *        extent
         * @param {string|number} [args.values.ymax] Northernmost map
         *        extent
         * @param {string|number} [args.values.wkid] wkid for extents
         *        coordinates
         *
         * @param {object} [args.i18n] Key-value pairs for text
         *        strings for non-configurable elements (LGGraphic)
         *
         * @constructor
         * @class
         * @name js.LGMap
         * @extends js.LGGraphic
         * @classdesc
         * Provides a UI web map display.
         */
        constructor: function () {
            var options, minmax, extents = null, pThis = this;

            /**
             * Provides a way to test the success or failure of the map
             * loading.
             * @member {Deferred} ready
             * @memberOf js.LGMap#
             */
            this.ready = new dojo.Deferred();

            options = {ignorePopups: false};
            options.mapOptions = this.mapOptions || {};
            options.mapOptions.showAttribution = true;

            this.popup = new esri.dijit.Popup(null, dojo.create("div"));
            options.mapOptions.infoWindow = this.popup;

            // Set up configured extents
            if (this.xmin && this.ymin && this.xmax && this.ymax) {
                try {
                    extents = {
                        xmin: this.xmin,
                        ymin: this.ymin,
                        xmax: this.xmax,
                        ymax: this.ymax
                    };

                    extents.spatialReference = {};
                    if (this.wkid) {
                        extents.spatialReference.wkid = Number(this.wkid);
                    } else {
                        extents.spatialReference.wkid = 102100;
                    }
                    extents = new esri.geometry.Extent(extents);
                } catch (err1) {
                    extents = null;
                }
            }

            // Override the initial extent from the configuration with URL extent values;
            // need to have a complete set of the latter
            if (this.ex) {
                minmax = this.ex.split(",");
                try {
                    extents = {
                        xmin: Number(minmax[0]),
                        ymin: Number(minmax[1]),
                        xmax: Number(minmax[2]),
                        ymax: Number(minmax[3])
                    };

                    extents.spatialReference = {};
                    if (minmax.length > 4) {
                        extents.spatialReference.wkid = Number(minmax[4]);
                    } else {
                        extents.spatialReference.wkid = 102100;
                    }
                    extents = new esri.geometry.Extent(extents);
                } catch (err2) {
                    extents = null;
                }
            }

            // Do we have a Bing maps key?
            if (this.commonConfig && this.commonConfig.bingMapsKey) {
                options.bingMapsKey = this.commonConfig.bingMapsKey;
            }

            // Set defaults for missing params
            this.lineHiliteColor = new Color(this.lineHiliteColor || "#00ffff");
            this.fillHiliteColor = new Color(this.fillHiliteColor || [0, 255, 255, 0.1]);

            // Create the map
            if (this.webmap) {
                this.mapId = this.webmap;
            }

            utils.createMap(this.mapId, this.rootDiv, options).then(
                function (response) {
                    pThis.mapInfo = response;

                    //for some reason if the webmap uses a bing map basemap the response doesn't have a spatialReference defined.
                    //this is a bit of a hack to set it manually
                    if (!response.map.spatialReference) {
                        pThis.mapInfo.map.spatialReference = new esri.SpatialReference({wkid: 102100});
                    }

                    //pThis.listeners.push(
                    //    dojo.connect(pThis.mapInfo.map, "onUnload", function () {  // release event listeners upon unload
                    //        // http://help.arcgis.com/en/webapi/javascript/arcgis/jshelp/inside_events.html
                    //        dojo.forEach(var fred in pThis.listeners) {
                    //            dojo.disconnect(fred);
                    //        }
                    //    });
                    //);
                    //pThis.listeners.push(
                    dojo.connect(window, "resize", pThis.mapInfo.map, function () {
                        pThis.mapInfo.map.resize();
                        pThis.mapInfo.map.reposition();
                    });
                    //);

                    // Jump to the initial extents
                    if (extents) {
                        // Set the initial extent, but keep the map's spatial reference,
                        // so we have to convert the extents to match the map
                        if (extents.spatialReference.wkid !== pThis.mapInfo.map.spatialReference.wkid) {
                            if (esri.config.defaults.geometryService) {
                                var params = new esri.tasks.ProjectParameters();
                                params.geometries = [extents];
                                params.outSR = pThis.mapInfo.map.spatialReference;
                                esri.config.defaults.geometryService.project(params).then(
                                    function (geometries) {
                                        extents = geometries[0];
                                        pThis.mapInfo.map.setExtent(extents);
                                    }
                                );
                            } else {
                                pThis.log("LGMap_1: " + "Need geometry service to convert extents from wkid "
                                    + extents.spatialReference.wkid
                                    + " to map's " + pThis.mapInfo.map.spatialReference.wkid);
                            }
                        } else {
                            pThis.mapInfo.map.setExtent(extents);
                        }
                    }

                    // Set up a graphics layer for receiving position updates and feature highlights
                    pThis.tempGraphicsLayer = pThis.createGraphicsLayer("tempGraphicsLayer");

                    // Start listening for position updates
                    pThis.positionHandle = topic.subscribe("position", function (newCenterPoint) {
                        pThis.tempGraphicsLayer.clear();

                        // Highlight the point's position if it's in the same coord system as the map
                        if (newCenterPoint.spatialReference.wkid === pThis.mapInfo.map.spatialReference.wkid) {
                            pThis.highlightPoint(newCenterPoint);

                        // Otherwise, convert the position into the map's spatial reference before highlighting it
                        } else {
                            // Use a shortcut routine for the geographic --> web mercator conversion
                            if (newCenterPoint.spatialReference.wkid === 4326
                                    && pThis.mapInfo.map.spatialReference.wkid === 102100) {
                                newCenterPoint = esri.geometry.geographicToWebMercator(newCenterPoint);
                                pThis.highlightPoint(newCenterPoint);

                            // Otherwise, use the geometry service
                            } else if (esri.config.defaults.geometryService) {
                                var params = new esri.tasks.ProjectParameters();
                                params.geometries = [newCenterPoint];
                                params.outSR = pThis.mapInfo.map.spatialReference;
                                esri.config.defaults.geometryService.project(params).then(
                                    function (geometries) {
                                        newCenterPoint = geometries[0];
                                        pThis.highlightPoint(newCenterPoint);
                                    }
                                );

                            // If we can't convert, we can't highlight
                            } else {
                                pThis.log("LGMap_1: " + "Need geometry service to convert position from wkid "
                                    + newCenterPoint.spatialReference.wkid
                                    + " to map's " + pThis.mapInfo.map.spatialReference.wkid);
                            }
                        }
                    });

                    // Start listening for feature highlights
                    pThis.showFeatureHandle = topic.subscribe("showFeature", function (feature) {
                        pThis.tempGraphicsLayer.clear();

                        // Do the highlight
                        pThis.highlightFeature(feature);
                    });

                    pThis.ready.resolve(pThis);
                },
                function () {
                    pThis.ready.reject(pThis);
                }
            );
        },

        /**
         * Returns the object's mapInfo object, which contains the
         * webmap creation information and the ArcGIS API map object.
         * @return {object} Object's mapInfo object
         * @memberOf js.LGMap#
         */
        mapInfo: function () {
            return this.mapInfo;
        },

        /**
         * Sets the popup template to be used by graphics that the map
         * creates.
         * @param {object} popupTemplate esri.dijit.PopupTemplate for
         *        map's infoWindow
         * @memberOf js.LGMap#
         */
        setPopup: function (popupTemplate) {
            this.popupTemplate = popupTemplate;
        },

        /**
         * Highlights a point by drawing a marker over it and centers
         * the map on the point.
         * @param {object} newCenterPoint Point to highlight
         * @memberOf js.LGMap#
         */
        highlightPoint: function (newCenterPoint) {
            // Shift the map
            this.mapInfo.map.centerAt(newCenterPoint);

            // Draw the location indicator
            this.tempGraphicsLayer.add(
                new esri.Graphic(newCenterPoint,
                    new esri.symbol.PictureMarkerSymbol("images/youAreHere.png", 30, 30), //???
                    null, null)
            );
        },

        /**
         * Highlights a polyline or polygon by drawing a line symbol
         * over its boundaries and centers the map on 4x the extents of
         * the feature.
         * @param {object} feature Feature to highlight
         * @memberOf js.LGMap#
         */
        highlightFeature: function (feature) {
            var extent, symbol, highlightGraphic, newMapCenter, focusFinished, pThis = this;

            if (feature.geometry && feature.geometry.getExtent) {
                extent = feature.geometry.getExtent();
            }

            // Polyline or polygon symbol whose extents are used to reposition & rezoom the map
            if (extent) {
                // Shift the map
                focusFinished = this.mapInfo.map.setExtent(extent.expand(4));
                newMapCenter = extent.getCenter();

                // Create the feature highlight
                if (feature.geometry.type === "polyline") {
                    symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                        this.lineHiliteColor, 3);
                } else {
                    symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                            this.lineHiliteColor, 3), this.fillHiliteColor);
                }
                highlightGraphic = new esri.Graphic(feature.geometry,
                    symbol, feature.attributes, null);

            // Point symbol used to reposition the map
            } else {
                if (feature.geometry) {
                    newMapCenter = feature.geometry;
                } else {
                    newMapCenter = feature;
                }

                // Shift the map
                focusFinished = this.mapInfo.map.centerAt(newMapCenter);

                // Create the feature highlight
                highlightGraphic = new esri.Graphic(newMapCenter,
                    new esri.symbol.PictureMarkerSymbol("images/youAreHere.png", 30, 30), //???
                    null, null);
            }

            // Display the highlight
            this.tempGraphicsLayer.add(highlightGraphic);

            // If we have a popup, prep & display it
            if (this.popupTemplate) {
                // Assign the popup template to the highlight & populate the infoWindow;
                // we need to clear the infoWindow's feature list because the infoWindow
                // doesn't work well with a mix of direct-click feature selection and this
                // routine's feature
                highlightGraphic.setInfoTemplate(this.popupTemplate);
                this.popup.clearFeatures();
                this.popup.setContent(highlightGraphic.getContent());

                // When the map is done with recentering, show the infoWindow
                focusFinished.then(function () {
                    pThis.mapInfo.map.infoWindow.show(pThis.mapInfo.map.toScreen(newMapCenter));
                });
            }
        },

        /**
         * Creates a string from the map's current extents.
         * @return {string} Comma-separated extents in the order xmin,
         *         ymin, xmax, ymax, spatial reference's wkid
         * @memberOf js.LGMap#
         */
        getExtentsString: function () {
            var extent, extentsString = "";
            if (this.mapInfo && this.mapInfo.map) {
                extent = this.mapInfo.map.extent;
                extentsString =
                    extent.xmin.toFixed().toString() + "," +
                    extent.ymin.toFixed().toString() + "," +
                    extent.xmax.toFixed().toString() + "," +
                    extent.ymax.toFixed().toString() + "," +
                    extent.spatialReference.wkid.toString();
            }
            return extentsString;
        },

        /**
         * Returns the layer with the specified name.
         * @param {string} name Layer name to look for
         * @return {object} Layer or null
         * @memberOf js.LGMap#
         */
        getLayer: function (name) {
            var layer;

            // Find the operational layer that matches the specified search layer
            array.some(this.mapInfo.itemInfo.itemData.operationalLayers, function (opLayer) {
                if (opLayer.title === name) {
                    layer = opLayer.layerObject;
                    return true;
                }
                return false;
            });

            return layer;
        },

        /**
         * Returns the names of the operational layers in the map.
         * @return {array} List of layers
         * @memberOf js.LGMap#
         */
        getLayerNameList: function () {
            var layerNameList = [];

            array.forEach(this.mapInfo.itemInfo.itemData.operationalLayers, function (layer) {
                layerNameList.push(layer.title);
            });

            return layerNameList;
        },

        /**
         * Creates a graphics layer for the object's map.
         * @param {string} layerId Name for layer
         * @return {GraphicsLayer} Created graphics layer
         * @memberOf js.LGMap#
         */
        createGraphicsLayer: function (layerId) {
            var gLayer = new esri.layers.GraphicsLayer();
            gLayer.id = layerId;
            return this.mapInfo.map.addLayer(gLayer);
        }
    });

    //========================================================================================================================//

});

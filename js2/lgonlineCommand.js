/*global define,dojo,js,window,touchScroll,Modernizr,navigator,esri,alert,setTimeout,clearTimeout */
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
define("js/lgonlineCommand", ["dijit", "dijit/registry", "dojo/dom-construct", "dojo/on", "dojo/dom-style", "dojo/_base/array", "dojo/topic", "esri/dijit/BasemapGallery", "js/lgonlineBase", "js/lgonlineMap"], function (dijit, registry, domConstruct, on, domStyle, array, topic, BasemapGallery) {

    //========================================================================================================================//

    dojo.declare("js.LGDropdownBox", js.LGGraphic, {
        /**
         * Constructs an LGDropdownBox.
         *
         * @constructor
         * @class
         * @name js.LGDropdownBox
         * @extends js.LGGraphic
         * @classdesc
         * Provides a generic dropdown that toggles its visibility based
         * on a subscription to a trigger message.
         */
        constructor: function () {
            var pThis = this;

            this.applyTheme(false);

            // Start listening for activation/deactivation call
            if (this.trigger) {
                topic.subscribe("command", function (sendingTrigger) {
                    if (sendingTrigger !== pThis.trigger) {
                        pThis.setIsVisible(false);
                    }
                });
                topic.subscribe(this.trigger, function (data) {
                    pThis.handleTrigger(data);
                });
            }
        },

        /**
         * Handles a trigger by toggling visibility.
         * @param {object} [data] Data accompanying trigger.
         * @memberOf js.LGDropdownBox#
         */
        handleTrigger: function () {
            this.toggleVisibility();
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGMapBasedMenuBox", [js.LGDropdownBox, js.LGMapDependency], {
        /**
         * Constructs an LGMapBasedMenuBox.
         *
         * @constructor
         * @class
         * @name js.LGMapBasedMenuBox
         * @extends js.LGDropdownBox, js.LGMapDependency
         * @classdesc
         * Provides a UI display of a menu that is not available until
         * the specified map is available.
         */
        constructor: function () {
            this.ready = new dojo.Deferred();
        },

        /**
         * Performs class-specific setup when the dependency is
         * satisfied.
         * @memberOf js.LGMapBasedMenuBox#
         * @override
         */
        onDependencyReady: function () {
            this.ready.resolve(this);
            this.inherited(arguments);
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGBasemapBox", js.LGMapBasedMenuBox, {
        /**
         * Constructs an LGBasemapBox.
         *
         * @class
         * @name js.LGBasemapBox
         * @extends js.LGMapBasedMenuBox
         * @classdesc
         * Provides a UI holder for the JavaScript API's basemap
         * gallery.
         */

        /**
         * Performs class-specific setup when the dependency is
         * satisfied.
         * @memberOf js.LGBasemapBox#
         * @override
         */
        onDependencyReady: function () {
            var galleryId, galleryHolder, basemapGallery, basemapGroup = this.getBasemapGroup();

            galleryId = this.rootId + "_gallery";

            galleryHolder = new dijit.layout.ContentPane({
                id: galleryId,
                className: this.galleryClass
            }).placeAt(this.rootDiv);
            touchScroll(galleryId);

            basemapGallery = new BasemapGallery({
                showArcGISBasemaps: true,  // ignored if a group is configured
                basemapsGroup: basemapGroup,
                bingMapsKey: this.mapObj.commonConfig.bingMapsKey,
                map: this.mapObj.mapInfo.map
            }, dojo.create('div')).placeAt(this.rootDiv);
            galleryHolder.set('content', basemapGallery.domNode);

            basemapGallery.startup();

            this.inherited(arguments);
        },

        getBasemapGroup: function () {
            var basemapGroup = null;

            if (this.basemapgroupTitle && this.basemapgroupOwner &&
                    this.basemapgroupTitle.length > 0 && this.basemapgroupOwner.length > 0) {
                basemapGroup = {
                    "title": this.basemapgroupTitle,
                    "owner": this.basemapgroupOwner
                };
            }

            return basemapGroup;
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGCallMethods", js.LGObject, {
        /**
         * Constructs an LGCallMethods and executes the list of tasks in
         * its definition.
         *
         * @constructor
         * @class
         * @name js.LGCallMethods
         * @extends js.LGObject
         * @classdesc
         * Provides a way for object methods to be called as part of the
         * LGUIBuilder JSON script execution.
         */
        constructor: function () {
            var target,
                pThis = this;

            if (this.todo) {
                // For each item in to-do list, get the id of the item, then call the specified method with the specified arg
                array.forEach(this.todo, function (task) {
                    try {
                        target = dojo.byId(task.rootId);
                        if (target) {
                            target = target.getLGObject();
                            if (target) {
                                target[task.method](task.arg);
                            }
                        }
                    } catch (error) {
                        pThis.log("LGCallMethods_1: " + error.toString());
                    }
                });
            }
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGCommand", [js.LGGraphic, js.LGDependency], {
        /**
         * Constructs an LGCommand.
         *
         * @param {object} [args.parentDiv] Name of DOM
         *        object into which the LGGraphic is to be placed
         *        (LGGraphic)
         * @param {string} args.rootId Id for root div of created object
         *        (LGGraphic)
         * @param {string} [args.rootClass] Name of CSS class to
         *        use for the root container of the object (LGGraphic)
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
         * @param {string} [args.iconClass] Name of CSS class to
         *        use for icon
         * @param {string} [args.displayText] Text to display in div;
         *        only used if iconUrl not supplied
         * @param {string} [args.displayTextClass] Name of CSS class to
         *        use for displayText
         *
         * @param {object} [args.values] Key-value pairs for
         *        configurable elements (LGGraphic)
         * @param {string} [args.values.iconUrl] Url to icon to display
         *        in div
         * @param {string} [args.values.tooltip] Text to display as
         *        tooltip
         *
         * @param {object} [args.i18n] Key-value pairs for text
         *        strings for non-configurable elements (LGGraphic)
         *
         * @constructor
         * @class
         * @name js.LGCommand
         * @extends js.LGGraphic, js.LGDependency
         * @classdesc
         * Builds and manages a UI object that represents a command.
         */
        constructor: function () {
            var attrs;

            this.applyTheme(true);

            // If we have an icon, add it to the face of the button
            if (this.iconUrl) {
                attrs = {src: this.iconUrl};
                if (this.iconClass) {
                    attrs.className = this.iconClass;
                }
                this.iconImg = dojo.create("img", attrs, this.rootDiv);
            }
            // If we have text, add it to the face of the button
            if (this.displayText) {
                attrs = {innerHTML: this.checkForSubstitution(this.displayText)};
                if (this.displayTextClass) {
                    attrs.className = this.displayTextClass;
                }
                dojo.create("div", attrs, this.rootDiv);
            }

            if (this.tooltip) {
                this.rootDiv.title = this.checkForSubstitution(this.tooltip);
            }

            // Hook up a click on the root div to the click handler; we use the root div so that
            // one can click outside of the icon and text
            if (this.publish) {
                this.clickHandler = on(this.rootDiv, "click", this.handleClick);
            }
        },

        /**
         * Performs class-specific setup before waiting for a
         * dependency.
         * @memberOf js.LGCommand#
         * @override
         */
        onDependencyPrep: function () {
            // Make command invisible until dependency resolved
            this.setIsVisible(false);
            this.inherited(arguments);
        },

        /**
         * Performs class-specific setup when the dependency is
         * satisfied.
         * @memberOf js.LGCommand#
         * @override
         */
        onDependencyReady: function () {
            // Make command invisible until dependency resolved
            this.setIsVisible(true);
            this.inherited(arguments);
        },

        /**
         * Handles a click event.
         * @param {object} evt Click event
         * @this {js.LGCommand}
         * @private
         * @memberOf js.LGCommand#
         * @override
         */
        handleClick: function (evt) {
            var obj = evt.currentTarget.getLGObject();
            topic.publish("command", obj.publish);
            topic.publish(obj.publish, obj.publishArg);
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGLaunchUrl", js.LGObject, {
        /**
         * Constructs an LGLaunchUrl.
         *
         * @constructor
         * @class
         * @name js.LGLaunchUrl
         * @extends js.LGObject
         * @classdesc
         * Opens a URL in response to a message.
         */
        constructor: function () {
            topic.subscribe(this.sameWinTrigger, function (url) {
                if (url) {
                    window.open(url, "_parent");
                }
            });
            topic.subscribe(this.newWinTrigger, function (url) {
                if (url) {
                    window.open(url, "_blank");
                }
            });
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGLocate", js.LGObject, {
        /**
         * Constructs an LGLocate.
         *
         * @constructor
         * @class
         * @name js.LGLocate
         * @extends js.LGObject
         * @classdesc
         * In response to a message, responds with another message with
         * the browser's location.
         */
        constructor: function () {
            var pThis = this, backupTimeoutTimer,
                // Make backup timeout that's later than the geolocation timeout
                // so that we don't get overlapping timeouts. Also, the backup
                // timeout occurs if the user takes too long to decide to accept
                // or to deny the location request (no harm in this--just an alert
                // appears).
                cTimeout = 8000 /* ms */, cBackupTimeout = 16000 /* ms */;

            // Object is ready only if geolocation is supported
            this.ready = new dojo.Deferred();
            if (!Modernizr.geolocation) {
                this.ready.reject(pThis);

            } else {
                // Start listening for a position request
                topic.subscribe(this.trigger, function () {

                    // Set a backup timeout because if one chooses "not now" for providing
                    // the position, the geolocation call does not return or time out
                    backupTimeoutTimer = setTimeout(function () {
                        alert(pThis.checkForSubstitution("@messages.geolocationTimeout"));
                    }, cBackupTimeout);

                    // Try to get the current position
                    navigator.geolocation.getCurrentPosition(function (position) {
                        clearTimeout(backupTimeoutTimer);

                        pThis.log("go to " + position.coords.latitude + " " + position.coords.longitude);
                        topic.publish(pThis.publish, new esri.geometry.Point(
                            position.coords.longitude,
                            position.coords.latitude,
                            new esri.SpatialReference({ wkid: 4326 })
                        ));
                    }, function (error) {
                        var message;
                        clearTimeout(backupTimeoutTimer);

                        // Report the location failure
                        switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = pThis.checkForSubstitution("@messages.geolocationDenied");
                            break;
                        case error.TIMEOUT:
                            message = pThis.checkForSubstitution("@messages.geolocationTimeout");
                            break;
                        default:
                            message = pThis.checkForSubstitution("@messages.geolocationUnavailable");
                            break;
                        }
                        alert(message);
                    }, {
                        timeout: cTimeout
                    });
                });
                this.ready.resolve(pThis);
            }
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGSearch", js.LGObject, {
        /**
         * LGSearch
         *
         * @constructor
         * @class
         * @name js.LGSearch
         * @extends js.LGObject
         * @classdesc
         * Provides a base class for searchers.
         */
        constructor: function () {
            if (this.busyIndicator) {
                this.busyIndicator = dojo.byId(this.busyIndicator).getLGObject();
            }
        },

        /**
         * Launches a search of the instance's search type.
         * @param {string|geometry} searchText Text or geometry to search
         * @param {function} callback Function to call when search
         *        results arrive
         * @param {function} errback Function to call when search
         *        fails
         * @memberOf js.LGSearch#
         * @see Interface stub
         */
        search: function () {
            return null;
        },

        /**
         * Formats results into a list of structures; each structure
         * contains a label and an optional data structure.
         * @param {object} results Search-specific results
         * @param {string} [searchText] Search text
         * @return {array} List of structures
         * @memberOf js.LGSearch#
         * @see Interface stub
         */
        toList: function () {
            return [];
        },

        /**
         * Publishes the specified data after performing any post
         * processing.
         * @param {string} subject Publishing topic name
         * @param {object} [data] Object to publish under topic
         * @memberOf js.LGSearch#
         * @see Interface stub. The data are those set up by the toList
         *       function and could be final or intermediate results.
         *       For intermediate results, the publish function is the
         *       place for the searcher to complete the data-retrieval
         *       process before publishing.
         */
        publish: function (subject, data) {
            topic.publish(subject, data);
        },

        /**
         * Provides an array sort function that sorts by the "label"
         * attribute of the supplied items.
         * @param {object} a Array sort item
         * @param {object} b Array sort item
         * @return {number} -1 if a<b, 0 if a=b, and 1 if a>b;
         *         comparison uses the label's localCompare() function
         * @memberOf js.LGSearch#
         */
        sortByLabel: function (a, b) {
            var sortResult = 0;
            if (a && b && a.label && b.label) {
                sortResult = a.label.localeCompare(b.label);
            }
            return sortResult;
        },

        /**
         * Returns a point that represents the geometry.
         * @param {object} geom Some geometry
         * @return {object} if geom is a point, returns geom; if geom is
         *         a polygon, returns the centerpoint of the polygon if
         *         that centerpoint is within geom; otherwise, returns
         *         the first point of the polygon; if geom is a
         *         polyline, returns the first point of geom
         * @memberOf js.LGSearch#
         */
        getRepresentativePoint: function (geom) {
            var repPoint;

            if ("point" === geom.type) {
                repPoint = geom;
            } else if ("polygon" === geom.type) {
                repPoint = geom.getExtent().getCenter();
                if (!geom.contains(repPoint)) {
                    repPoint = geom.getPoint(0, 0);
                }
            } else if ("polyline" === geom.type) {
                repPoint = geom.getPoint(0, 0);
            }

            return repPoint;
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGSearchAddress", js.LGSearch, {
        /**
         * Constructs an LGSearchAddress.
         *
         * @constructor
         * @class
         * @name js.LGSearchAddress
         * @extends js.LGSearch
         * @classdesc
         * Provides a searcher for addresses.
         */
        constructor: function () {
            this.searcher = new esri.tasks.Locator(this.searchUrl);
            this.searcher.outSpatialReference = new esri.SpatialReference({"wkid": this.outWkid});
            this.params = {};
            this.params.outFields = this.outFields;
            this.ready = new dojo.Deferred();
            this.ready.resolve(this);
        },

        /**
         * Launches a search of the instance's search type.
         * @param {string|geometry} searchText Text or geometry to search
         * @param {function} callback Function to call when search
         *        results arrive; function takes the results as its sole
         *        argument
         * @memberOf js.LGSearchAddress#
         * @override
         */
        search: function (searchText, callback, errback) {
            this.params.address = {};
            this.params.address[this.addressParamName] = searchText;
            this.searcher.addressToLocations(this.params, callback, errback);
        },

        /**
         * Formats results into a list of structures; each structure
         * contains a label and an optional data structure.
         * @param {object} results Search-specific results
         * @param {string} [searchText] Search text
         * @return {array} List of structures; label is tagged with
         *         "label" and data is tagged with "data"
         * @memberOf js.LGSearchAddress#
         * @override
         */
        toList: function (results, searchText) {
            var ok, pThis = this, resultsList = [];
            if (results) {
                // Filter results by desired score and locator
                array.forEach(results, function (item) {
                    ok = false;
                    if (item.score >= pThis.minimumScore) {
                        if (pThis.validLocators) {
                            array.some(pThis.validLocators, function (entry) {
                                if (item.attributes.Loc_name === entry) {
                                    ok = true;
                                    return true;
                                }
                            });
                        } else {
                            ok = true;
                        }
                    }
                    if (ok) {
                        resultsList.push({
                            "label": item.address,
                            "data": new esri.geometry.Point(
                                item.location.x,
                                item.location.y,
                                new esri.SpatialReference({ wkid: 102100 })
                            )
                        });
                    }
                });
            }
            return resultsList;
        },

        /**
         * Publishes the specified data after performing any post
         * processing.
         * @param {string} subject Publishing topic name
         * @param {object} data Object to publish under topic
         * @see Interface stub. The data are those set up by the toList
         *       function and could be final or intermediate results.
         *       For intermediate results, the publish function is the
         *       place for the searcher to complete the data-retrieval
         *       process before publishing.
         * @memberOf js.LGSearchAddress#
         * @override
         */
        publish: function (subject, data) {
            topic.publish(subject, data);
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGSearchBoxByText", js.LGDropdownBox, {
        /**
         * Constructs an LGSearchBoxByText.
         *
         * @constructor
         * @class
         * @name js.LGSearchBoxByText
         * @extends js.LGDropdownBox
         * @classdesc
         * Provides a UI display of a prompted text box followed by a
         * list of results.
         */
        constructor: function () {
            var pThis = this, textBoxId, searchEntryTextBox, resultsListBox, table, tableBody,
                searcher, lastSearchString, lastSearchTime, stagedSearch;

            textBoxId = this.rootId + "_entry";

            domConstruct.create("label",
                {"for": textBoxId, innerHTML: this.checkForSubstitution(this.showPrompt)}, this.rootId);
            searchEntryTextBox = new dijit.form.TextBox({
                id: textBoxId,
                value: "",
                trim: true,
                placeHolder: this.hint,
                intermediateChanges: true
            }).placeAt(this.rootId);
            domStyle.set(registry.byId(textBoxId).domNode, "width", "99%");

            resultsListBox = domConstruct.create("div",
                {className: this.resultsListBoxClass}, this.rootId);
            table = domConstruct.create("table",
                {className: this.resultsListTableClass}, resultsListBox);
            tableBody = domConstruct.create("tbody",
                {className: this.resultsListBodyClass}, table);
            touchScroll(resultsListBox);

            searcher = dojo.byId(this.searcher).getLGObject();
            lastSearchString = "";
            lastSearchTime = 0;
            stagedSearch = null;

            // Run a search when the entry text changes
            on(searchEntryTextBox, "change", function () {
                var searchText = searchEntryTextBox.get("value");
                if (lastSearchString !== searchText) {
                    lastSearchString = searchText;
                    dojo.empty(tableBody);

                    // Clear any staged search
                    clearTimeout(stagedSearch);

                    if (searchText.length > 0) {
                        // Stage a new search, which will launch if no new searches show up
                        // before the timeout
                        stagedSearch = setTimeout(function () {
                            var searchingPlaceholder, thisSearchTime, now;

                            searchingPlaceholder = domConstruct.create("tr", null, tableBody);
                            domConstruct.create("td",
                                {className: pThis.resultsListSearchingClass}, searchingPlaceholder);

                            thisSearchTime = lastSearchTime = (new Date()).getTime();
                            searcher.search(searchText, function (results) {
                                var resultsList;

                                // Discard searches made obsolete by new typing from user
                                if (thisSearchTime < lastSearchTime) {
                                    return;
                                }

                                // Show results
                                dojo.empty(tableBody);  // to get rid of searching indicator
                                resultsList = searcher.toList(results, searchText);

                                now = (new Date()).getTime();
                                pThis.log("retd " + resultsList.length + " items in "
                                    + (now - thisSearchTime) / 1000 + " secs");

                                if (resultsList.length > 0) {
                                    array.forEach(resultsList, function (item) {
                                        var tableRow, tableCell;

                                        tableRow = domConstruct.create("tr",
                                            null, tableBody);
                                        tableCell = domConstruct.create("td",
                                            {className: pThis.resultsListEntryClass, innerHTML: item.label}, tableRow);
                                        pThis.applyTheme(true, tableCell);
                                        on(tableCell, "click", function () {
                                            searcher.publish(pThis.publish, item.data);
                                        });
                                    });
                                }
                            }, function (error) {
                                // Query failure
                                pThis.log("LGSearchBoxByText_1: " + error.message);

                                lastSearchString = "";  // so that we can quickly repeat this search
                                dojo.empty(tableBody);  // to get rid of searching indicator
                            });
                        }, 1000);
                    }
                }
            });
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGSearchFeatureLayer", [js.LGSearch, js.LGMapDependency], {
        /**
         * Constructs an LGSearchFeatureLayer.
         *
         * @constructor
         * @class
         * @name js.LGSearchFeatureLayer
         * @extends js.LGSearch, js.LGMapDependency
         * @classdesc
         * Provides a searcher for feature layers.
         */
        constructor: function () {
            if (!this.searchPattern || this.searchPattern.indexOf("${1}") < 0) {
                this.searchPattern = "%${1}%";
            }
            if (this.caseInsensitiveSearch === undefined || this.caseInsensitiveSearch === "true"
                    || this.caseInsensitiveSearch === true) {
                this.caseInsensitiveSearch = true;
            } else {
                this.caseInsensitiveSearch = false;
            }
            this.ready = new dojo.Deferred();
        },

        /**
         * Performs class-specific setup when the dependency is
         * satisfied.
         * @memberOf js.LGSearchFeatureLayer#
         * @override
         */
        onDependencyReady: function () {
            // Now that the map (our dependency) is ready, get the URL of the search layer from it
            var searchLayer, reason, message, availableFields = ",", opLayers,
                popupTemplate = null, pThis = this;

            try {
                searchLayer = this.mapObj.getLayer(this.searchLayerName);
                if (!searchLayer || !searchLayer.url) {
                    reason = this.checkForSubstitution("@messages.searchLayerMissing");
                } else {
                    this.searchURL = searchLayer.url;

                    // Check for existence of fields
                    array.forEach(searchLayer.fields, function (layerField) {
                        availableFields += layerField.name + ",";
                    });
                    if (!array.every(this.searchFields, function (searchField) {
                            reason = searchField;
                            return availableFields.indexOf("," + searchField + ",") >= 0;
                        })) {

                        // Failed to find the field in the search layer; provide some feedback
                        message = "\"" + reason + "\"<br>";
                        message += this.checkForSubstitution("@messages.searchFieldMissing") + "<br><hr><br>";
                        message += this.checkForSubstitution("@prompts.layerFields") + "<br>";
                        if (availableFields.length > 1) {
                            message += availableFields.substring(1, availableFields.length - 1);
                        }
                        this.log(message, true);
                    }

                    // Set up our query task now that we have the URL to the layer
                    this.objectIdField = searchLayer.objectIdField;
                    this.publishPointsOnly = (typeof this.publishPointsOnly === "boolean") ? this.publishPointsOnly : true;

                    this.searcher = new esri.tasks.QueryTask(this.searchURL);

                    // Set up the general layer query task: pattern match
                    this.generalSearchParams = new esri.tasks.Query();
                    this.generalSearchParams.returnGeometry = false;
                    this.generalSearchParams.outSpatialReference = this.mapObj.mapInfo.map.spatialReference;
                    this.generalSearchParams.outFields = [searchLayer.objectIdField].concat(this.searchFields);

                    // Set up the specific layer query task: object id
                    this.objectSearchParams = new esri.tasks.Query();
                    this.objectSearchParams.returnGeometry = true;
                    this.objectSearchParams.outSpatialReference = this.mapObj.mapInfo.map.spatialReference;
                    this.objectSearchParams.outFields = ["*"];

                    // Get the popup for this layer & send it to the map
                    opLayers = this.mapObj.mapInfo.itemInfo.itemData.operationalLayers;
                    array.some(opLayers, function (layer) {
                        if (layer.title === pThis.searchLayerName) {
                            popupTemplate = new esri.dijit.PopupTemplate(layer.popupInfo);
                            return true;
                        }
                        return false;
                    });
                    this.mapObj.setPopup(popupTemplate);

                    this.log("Search layer " + this.searchLayerName + " set up for queries");
                    this.ready.resolve(this);
                    this.inherited(arguments);
                    return;
                }
            } catch (error) {
                reason = error.toString();
            }

            // Failed to find the search layer; provide some feedback
            message = "\"" + this.searchLayerName + "\"<br>";
            message += reason + "<br><hr><br>";
            message += this.checkForSubstitution("@prompts.mapLayers") + "<br><ul>";
            array.forEach(this.mapObj.getLayerNameList(), function (layerName) {
                message += "<li>\"" + layerName + "\"</li>";
            });
            message += "</ul>";
            this.log(message, true);

            this.ready.reject(this);
            this.inherited(arguments);
        },

        /**
         * Checks that the instance has its prerequisites.
         * @throws {string} "missing search fields" if the search fields
         *        parameter is omitted
         * @memberOf js.LGSearchFeatureLayer#
         * @override
         */
        checkPrerequisites: function () {
            var splitFields, pThis = this;

            if (this.searchFields && 0 < this.searchFields.length) {
                splitFields = this.searchFields.split(",");
                this.searchFields = [];
                array.forEach(splitFields, function (searchField) {
                    pThis.searchFields.push(searchField.trim());
                });
            } else {
                this.log("missing search fields");
                throw "missing search fields";
            }
        },

        /**
         * Launches a search.
         * @param {string|geometry} searchText Text to search
         * @param {function} callback Function to call when search
         *        results arrive; function takes the results as its sole
         *        argumentsss
         * @memberOf js.LGSearchFeatureLayer#
         * @override
         */
        search: function (searchText, callback, errback) {
            var processedSearchText,
                searchParam = "",
                attributePattern,
                attributeSeparator = "",
                attributeSeparatorReset = "  OR  ";  // thanks to Tim H.: single spaces don't work with some DBs

            if (this.caseInsensitiveSearch === true) {
                processedSearchText = searchText.toUpperCase();
                attributePattern = "UPPER(${0}) LIKE '" + this.searchPattern + "'";
            } else {
                processedSearchText = searchText;
                attributePattern = "${0} LIKE '" + this.searchPattern + "'";
            }

            array.forEach(this.searchFields, function (searchField) {
                searchParam = searchParam + attributeSeparator
                    + dojo.string.substitute(attributePattern, [searchField, processedSearchText]);
                attributeSeparator = attributeSeparatorReset;
            });
            if (0 < searchParam.length) {
                this.generalSearchParams.where = searchParam;
                this.searcher.execute(this.generalSearchParams, callback, errback);
            }
        },

        /**
         * Formats results into a list of structures; each structure
         * contains a label and an optional data structure.
         * @param {object} results Search-specific results
         * @param {string} searchText Search text
         * @return {array} List of structures; label is tagged with
         *         "label" and data is tagged with "data"
         * @memberOf js.LGSearchFeatureLayer#
         * @override
         */
        toList: function (results, searchText) {
            var pThis = this, resultsList = [], possibleLabel, representativeLabel,
                processedSearchText = searchText.toUpperCase();

            if (results && results.features && 0 < results.features.length) {
                // Create the results list
                array.forEach(results.features, function (item) {

                    // Test each non-null search field result and pick the first one
                    // that contains the search string as our label
                    representativeLabel = "";
                    array.some(pThis.searchFields, function (searchField) {
                        if (item.attributes[searchField]) {
                            possibleLabel = item.attributes[searchField].toString();
                            if (possibleLabel.toUpperCase().indexOf(processedSearchText) >= 0) {
                                representativeLabel = possibleLabel;
                                return true;
                            }
                        }
                        return false;
                    });

                    if (representativeLabel === "") {
                        representativeLabel = "result";
                    }

                    // Create the entry for this result
                    resultsList.push({
                        "label": representativeLabel,
                        "data": item.attributes[pThis.objectIdField]
                    });
                });

                // Results are sorted by their label field
                resultsList.sort(pThis.sortByLabel);
            }

            return resultsList;
        },

        /**
         * Publishes the specified data after performing any post
         * processing.
         * @param {string} subject Publishing topic name
         * @param {object} data Object to publish under topic
         * @see Interface stub. The data are those set up by the toList
         *       function and could be final or intermediate results.
         *       For intermediate results, the publish function is the
         *       place for the searcher to complete the data-retrieval
         *       process before publishing.
         * @memberOf js.LGSearchFeatureLayer#
         * @override
         */
        publish: function (subject, data) {
            var item, representativeData, pThis = this;

            if (this.busyIndicator) {
                this.busyIndicator.setIsVisible(true);
            }

            // Search for the supplied object id
            this.objectSearchParams.where = this.objectIdField + "=" + data;
            this.searcher.execute(this.objectSearchParams, function (results) {
                if (results && results.features && 0 < results.features.length) {
                    item = results.features[0];

                    if (pThis.publishPointsOnly) {
                        // Find a point that can be used to represent this item
                        representativeData = pThis.getRepresentativePoint(item.geometry);
                    } else {
                        representativeData = item;
                    }

                    topic.publish(subject, representativeData);
                } else {
                    // No-results failure
                    pThis.log("LGSearchFeatureLayer_1: no results");
                }

                if (pThis.busyIndicator) {
                    pThis.busyIndicator.setIsVisible(false);
                }
            }, function (error) {
                // Query failure
                pThis.log("LGSearchFeatureLayer_2: " + error.message);

                if (pThis.busyIndicator) {
                    pThis.busyIndicator.setIsVisible(false);
                }
            });
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGShare", js.LGObject, {
        /**
         * Constructs an LGShare.
         *
         * @constructor
         * @class
         * @name js.LGShare
         * @extends js.LGObject
         * @classdesc
         * Provides the base capability for sharing.
         */
        constructor: function () {
            var pThis = this;
            if (this.busyIndicator) {
                this.busyIndicator = dojo.byId(this.busyIndicator).getLGObject();
            }
            topic.subscribe(this.trigger, function () {
                pThis.share();
            });
        },

        /**
         * Performs sharing steps:  get URL, compress it, publish
         * result.
         * @memberOf js.LGShare
         */
        share: function () {
            var pThis = this, subjectLine, urlToShare, compressionUrl;
            subjectLine = encodeURIComponent(this.getSubject());
            urlToShare = encodeURIComponent(this.getUrlToShare());

            if (this.tinyURLServiceURL && this.tinyURLServiceURL.length > 0) {
                // Put the URL to share into the compression method's URL & launch the compression
                if (this.busyIndicator) {
                    this.busyIndicator.setIsVisible(true);
                }

                compressionUrl = esri.substitute({url: urlToShare}, this.tinyURLServiceURL);
                esri.request({
                    url: compressionUrl,
                    handleAs: "json"
                }, {
                    useProxy: false
                }).then(function (response) {
                    var tinyUrl, shareUrl;

                    try {
                        // Step thru the chain of nested attributes to get to the tiny URL
                        tinyUrl = pThis.followAttributePath(response, pThis.tinyURLResponseAttribute);
                        if (tinyUrl) {
                            // Put the tiny URL into the sharing method's URL & launch the sharing method
                            shareUrl = esri.substitute({subject: subjectLine, url: tinyUrl}, pThis.shareUrl);
                            topic.publish(pThis.publish, shareUrl);
                        }
                    } catch (error) {
                        pThis.log("LGShare_1: " + error.toString());
                    }

                    if (pThis.busyIndicator) {
                        pThis.busyIndicator.setIsVisible(false);
                    }

                }, function (error) {
                    pThis.log("LGShare_2: " + error.toString());

                    if (pThis.busyIndicator) {
                        pThis.busyIndicator.setIsVisible(false);
                    }
                });
            } else {
                // Share the uncompressed URL
                urlToShare = esri.substitute({subject: subjectLine, url: urlToShare}, this.shareUrl);
                topic.publish(this.publish, urlToShare);
            }
        },

        /**
         * Returns the subject message to use in the sharing.
         * @return {string} subject
         * @memberOf js.LGShare
         */
        getSubject: function () {
            return "";
        },

        /**
         * Returns the app's URL as the item to share.
         * @return {string} URL
         * @memberOf js.LGShare
         */
        getUrlToShare: function () {
            return this.getAppUrl();
        },

        /**
         * Returns the app's URL.
         * @return {string} URL
         * @memberOf js.LGShare
         */
        getAppUrl: function () {
            return window.location.toString();
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGShareAppExtents", [js.LGShare, js.LGMapDependency], {
        /**
         * LGShareAppExtents
         *
         * @class
         * @name js.LGShareAppExtents
         * @extends js.LGShare, js.LGMapDependency
         * @classdesc
         * Extends simple sharing to include the app's map's current
         * extents.
         */

        /**
         * Returns the subject message to use in the sharing.
         * @return {string} subject
         * @memberOf js.LGShareAppExtents
         * @override
         */
        getSubject: function () {
            var subjectText = "";
            if (this.subject) {
                subjectText = this.checkForSubstitution(this.subject);
            }
            return subjectText;
        },

        /**
         * Returns the app's URL and its extents as the item to share.
         * @return {string} URL
         * @memberOf js.LGShareAppExtents
         * @override
         */
        getUrlToShare: function () {
            var baseUrl = this.getAppUrl();
            return baseUrl + (baseUrl.indexOf("?") < 0 ? "?" : "&") + this.getMapExtentsArg();
        },

        /**
         * Gets the app's map's extents.
         * @return {string} Extents as supplied by LGMap's
         *         getExtentsString()
         * @memberOf js.LGShareAppExtents
         */
        getMapExtentsArg: function () {
            return "ex=" + this.mapObj.getExtentsString();
        }
    });

    //========================================================================================================================//

});

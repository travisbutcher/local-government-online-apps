/*global define,dojo,js,touchScroll */
/*jslint sloppy:true */
/*
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
//============================================================================================================================//
define("js/lgonlineEditing", ["dojo/dom-construct", "dojo/on", "dojo/_base/array", "dojo/_base/lang", "dojo/aspect", "esri/dijit/editing/TemplatePicker", "esri/dijit/editing/Editor", "js/lgonlineBase", "js/lgonlineMap", "js/lgonlineCommand"], function (domConstruct, on, array, lang, aspect, TemplatePicker, Editor) {

    //========================================================================================================================//

    dojo.declare("js.LGEditTemplatePicker", js.LGMapBasedMenuBox, {
        /**
         * Constructs an LGEditTemplatePicker.
         *
         * @constructor
         * @class
         * @name js.LGEditTemplatePicker
         * @extends js.LGMapBasedMenuBox
         * @classdesc
         * Displays an Editing Template Picker.
         */
        constructor: function () {
            var colorizer, styleString;

            // "templatePicker" and "selectedItem" are hard-coded class names that the
            // esri.dijit.editing.TemplatePicker creates. We modify these classes to fit
            // with our app's theme. (The superclass applies the theme for the dropdown
            // that holds the picker, but we have to make the picker's backgrounds transparent
            // and deactivate the foreground colors in order to see the theme and we have to
            // manually set the theme for the selected item in the template picker because we
            // don't have a handle to the currently-selected item.)
            colorizer = dojo.byId(this.colorizerId).getLGObject();
            styleString =
                ".templatePicker{border:1px solid transparent!important;}" +
                ".templatePicker .dojoxGrid{background-color:transparent;}" +
                ".templatePicker .dojoxGrid .dojoxGridScrollbox{background-color:transparent;}" +
                ".templatePicker .dojoxGrid .dojoxGridRow{background-color:transparent;}" +
                ".templatePicker .dojoxGrid .dojoxGridCell{border:1px solid transparent}" +
                ".templatePicker .dojoxGrid .dojoxGridRow{border:1px solid transparent}" +
                ".templatePicker .grid .dojoxGridRowOver{background-color:transparent;color:inherit;}" +
                ".templatePicker .grid .dojoxGridRowOver .dojoxGridCell{background-color:transparent;color:inherit;}" +
                ".templatePicker .dojoxGrid .dojoxGridCellFocus{border:1px solid transparent!important;}" +
                ".templatePicker .dojoxGrid .dojoxGridRowOdd{background-color:transparent;}" +
                ".templatePicker .dojoxGrid .selectedItem{border:1px solid transparent!important;color:" +
                colorizer.foregroundColor() + "!important;background-color:" + colorizer.alternateBackgroundColor() +
                "!important}";
            this.injectCSS(styleString);
        },

        /**
         * Performs class-specific setup when the dependency is
         * satisfied.
         * @memberOf js.LGEditTemplatePicker#
         * @override
         */
        onDependencyReady: function () {
            var pThis = this, mapInfo, map, templatePickerHolder, templatePickerDiv,
                templatePicker, editorSettings, editor;

            // Build a list of editable layers in this map
            mapInfo = this.mapObj.mapInfo;
            this.layerInfos = [];
            this.layers = [];
            array.forEach(mapInfo.itemInfo.itemData.operationalLayers, lang.hitch(this, function (mapLayer) {
                var eLayer = mapLayer.layerObject;
                if (eLayer instanceof esri.layers.FeatureLayer && eLayer.isEditable()){
                    if (mapLayer.capabilities && mapLayer.capabilities === "Query"){
                        // capabilities set to Query, so editing was disabled in the web map
                    } else {
                        // Layers list for esri.dijit.editing.Editor
                        this.layerInfos.push({
                            "featureLayer": eLayer
                        });
                        // Layers list for esri.dijit.editing.TemplatePicker
                        this.layers.push(eLayer);
                    }
                }
            }));

            if (this.layers.length === 0) {
                // If there are no editable layers, we won't display the empty picker
                this.setShowable(false);

            } else {
                // Create a template picker and its associated editor for this map
                map = mapInfo.map;

                //------------------------- Template Picker dijit -------------------------
                // The template picker will not size properly if its containing divs have no
                // substance, so we'll hide the divs but give them substance (i.e., "display" is
                // "block" and "visibility" is "hidden")
                this.setIsVisible(false, true);

                // Create a frame to hold the picker within the dropdown
                templatePickerHolder = domConstruct.create("div",
                    { className: this.templatePickerHolderClass });
                domConstruct.place(templatePickerHolder, this.rootId);

                // Create a div that will become the picker
                templatePickerDiv = domConstruct.create("div");
                domConstruct.place(templatePickerDiv, templatePickerHolder);

                // Create a template picker using the editable layers
                templatePicker = new TemplatePicker({
                    featureLayers: this.layers,
                    rows: "auto",
                    columns: 2,
                    grouping: true
                }, templatePickerDiv);
                templatePicker.startup();
                touchScroll(templatePicker);

                // For compatibility with the dropdown mechanism, we'll switch to hiding the
                // divs without substance (i.e., "display" is "none" and "visibility" is "visible")
                this.setIsVisible(false, false);

                //------------------------- Editor dijit -------------------------
                // Create an editing tool linked to the template picker
                editorSettings = {
                    map: map,
                    templatePicker: templatePicker,
                    toolbarVisible: false,
                    layerInfos: this.layerInfos
                };
                editor = new Editor({ settings: editorSettings }, templatePickerDiv);
                editor.startup();

                // Provide a hook for preprocessing the edit before it is committed
                aspect.before(editor, "_applyEdits", function (edits) {
                    // "edits" is an array of edits; each edit contains the layer to be edited as well
                    // as optional arrays "adds", "updates", and "deletes"
                    array.forEach(edits, function (layerEdits) {
                        if (layerEdits.adds) {
                            pThis.preprocessEditAdds(layerEdits);
                        }
                        if (layerEdits.updates) {
                            pThis.preprocessEditUpdates(layerEdits);
                        }
                        if (layerEdits.deletes) {
                            pThis.preprocessEditDeletes(layerEdits);
                        }
                    });
                });

                //--------------------------------------------------
            }

            this.inherited(arguments);
        },

        /**
         * Preprocesses a set of "add" edits for a layer.
         * @param {object} layerEdits Structure containing "layer"--the layer to be
         * edited--and "adds"--an array of objects to be added
         * @memberOf js.LGEditTemplatePicker#
         */
        preprocessEditAdds: function (layerEdits) {
            return layerEdits;
        },

        /**
         * Preprocesses a set of "update" edits for a layer.
         * @param {object} layerEdits Structure containing "layer"--the layer to be
         * edited--and "updates"--an array of objects to be updated
         * @memberOf js.LGEditTemplatePicker#
         */
        preprocessEditUpdates: function (layerEdits) {
            return layerEdits;

        },

        /**
         * Preprocesses a set of "delete" edits for a layer.
         * @param {object} layerEdits Structure containing "layer"--the layer to be
         * edited--and "deletes"--an array of objects to be deleted
         * @memberOf js.LGEditTemplatePicker#
         */
        preprocessEditDeletes: function (layerEdits) {
            return layerEdits;
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGEditTemplatePickerWithDefaults", [js.LGEditTemplatePicker, js.LGDefaults], {
        /**
         * Constructs an LGEditTemplatePickerWithDefaults.
         *
         * @class
         * @name js.LGEditTemplatePickerWithDefaults
         * @extends js.LGEditTemplatePicker, js.LGDefaults
         * @classdesc
         * Displays an Editing Template Picker that contains default values for specified fields.
         */

        /**
         * Preprocesses a set of "add" edits for a layer.
         * @param {object} layerEdits Structure containing "layer"--the layer to be
         * edited--and "adds"--an array of objects to be added
         * @memberOf js.LGEditTemplatePickerWithDefaults#
         * @override
         */
        preprocessEditAdds: function (layerEdits) {
            layerEdits.adds[0].attributes[this.defaultValues.fieldname1] = this.defaultValues.value1;

            return layerEdits;
        }
    });

    //========================================================================================================================//

    dojo.declare("js.LGEditAttributes", [js.LGObject, js.LGMapDependency], {
        /**
         * Constructs an LGEditAttributes.
         *
         * @class
         * @name js.LGEditAttributes
         * @extends js.LGObject, js.LGMapDependency
         * @classdesc
         * Displays an info window that permits the entry or editing of a graphics attributes.
         */

        /**
         * Performs class-specific setup when the dependency is
         * satisfied.
         * @memberOf js.LGEditAttributes#
         * @override
         */
        onDependencyReady: function () {
            this.inherited(arguments);

            this.clickHandle = this.subscribeToMessage("mapClick", function (evt) {
                // Event is of the form:
                // {"type":"point","x":-9812146.796478976,"y":5126074.462209778,"spatialReference":{"wkid":102100}}

                console.log(evt.type);

            });


        }
    });

    //========================================================================================================================//

});

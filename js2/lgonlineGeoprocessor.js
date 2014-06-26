/*global define,dojo,js,require */
/*jslint browser:true,sloppy:true,nomen:true,unparam:true,plusplus:true */
/*
 | Copyright 2014 Esri
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
define("js/lgonlineGeoprocessor", [
    "dojo/Deferred",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "esri/tasks/Geoprocessor"
], function (
    Deferred,
    domConstruct,
    lang,
    Geoprocessor
) {

    //========================================================================================================================//

    dojo.declare("js.LGGeoprocessor", js.LGObject, {
        /**
         * Constructs an LGGeoprocessor.
         *
         * @constructor
         * @class
         * @name js.LGGeoprocessor
         * @extends js.LGObject
         * @classdesc
         * Provides basic structure for working with a geoprocessor.
         */
        constructor: function () {
            var pThis = this;

            this.downloadableResult = this.toBoolean(this.downloadableResult, false);
            this.publish = this.publish || "launch/blank";


            if (this.geoprocessorServiceURL) {
                this.geoprocessorService = new Geoprocessor(this.geoprocessorServiceURL);

                this.subscribeToMessage(this.trigger, function () {
                    var params = { "Address_Items": "1908252007,ABC,null,123 Main St,Bloomfield Hills,MI,48302,$1908252008,DEF,null,456 Main St,Bloomfield Hills,MI,48302," }; //???
                    pThis.submitJob(params);
                });
            }
        },

        /**
         * Submits the geoprocessor task.
         * @memberOf js.LGGeoprocessor#
         */
        submitJob: function (params) {
            if (this.geoprocessorService) {
                this.geoprocessorService.submitJob(params,
                    lang.hitch(this, this.completionCallback),
                    lang.hitch(this, this.statusCallback),
                    lang.hitch(this, this.errorCallback));
            } else {
                this.errorCallback();
            }
        },

        /**
         * Handles status updates from the geoprocessor task.
         * @param {object} jobinfo contains status regarding geoprocessing task
         * @memberOf js.LGGeoprocessor#
         */
        statusCallback: function (jobInfo) {
            var status = jobInfo.jobId + ": " + jobInfo.jobStatus;

            if (jobInfo.messages && jobInfo.messages.length > 0) {  //???
                status += ": " + jobInfo.messages[0];               //???
            }                                                       //???
            this.log(status);
        },

        /**
         * Handles completion notification from the geoprocessor task.
         * @param {object} jobinfo contains status regarding geoprocessing task
         * @memberOf js.LGGeoprocessor#
         */
        completionCallback: function (jobInfo) {
            if (jobInfo.jobStatus === "esriJobSucceeded") {
                this.successCallback(jobInfo);
            }
        },

        /**
         * Handles successful completion notification from the geoprocessor task.
         * @param {object} jobinfo contains status regarding geoprocessing task
         * @memberOf js.LGGeoprocessor#
         */
        successCallback: function (jobInfo) {
            if (this.downloadableResult) {
                this.geoprocessorService.getResultData(jobInfo.jobId,
                    "Output_File", lang.hitch(this, this.downloadCallback));
            }
        },

        /**
         * Handles a file download response from the geoprocessor task.
         * @param {object} jobinfo contains status regarding geoprocessing task
         * @memberOf js.LGGeoprocessor#
         */
        downloadCallback: function (fileInfo) {
            if (fileInfo && fileInfo.value && fileInfo.value.url) {
                this.publishMessage(this.publish, fileInfo.value.url);
            } else {
                this.log(this.checkForSubstitution(this.noResultsMessage || "!tasks.query.invalid"), true);
            }
        },

        /**
         * Handles failure of the geoprocessor task.
         * @param {string} error message when gp service fails
         * @memberOf js.LGGeoprocessor#
         */
        errorCallback: function (err) {
            var errorMessage =
                this.checkForSubstitution(this.noResultsMessage || "!tasks.query.invalid")
                + "<hr>" + err;
            this.log(errorMessage, true);
        }
    });

    //========================================================================================================================//

});

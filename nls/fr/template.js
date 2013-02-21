/** @license
 | ArcGIS for Local Government
 | Version 10.1.2
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
define(({
    tooltips: {
        search: "Rechercher",
        locate: "Mon emplacement actuel",
        markup: "Soumettre correction",
        basemap: "Inverser le fond de carte",
        share: "Partager",
        shareViaEmail: "Partager via courriel",
        shareViaFacebook: "Partager via Facebook",
        shareViaTwitter: "Partager via Twitter",
        help: "Renseignements"
    },
    labels: {
        email: "courriel",
        Facebook: "Facebook",
        Twitter: "Twitter"
    },
    prompts: {
        search: "Rechercher :",
        markup: "Dessiner",
        mapLayers: "Couches cartographiques :",
        layerFields: "Champs attributaires :"
    },
    messages: {
        geolocationDenied: "Ce site n'est pas autorisé à accéder à l'emplacement actuel",
        geolocationUnavailable: "Le navigateur n'a pas été en mesure d'obtenir l'emplacement actuel",
        geolocationTimeout: "Le navigateur n'a pas été en mesure d'obtenir l'emplacement actuel en temps opportun",
        searchLayerMissing: "Cette couche n'a pas été trouvée dans la carte",
        searchFieldMissing: "Ce champ attributaire n'a pas été trouvée dans la carte"
    }
}));

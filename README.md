<h1 align="center">Vue GIS Map Component</h1>

VueGIS is based on **Vue 3** with composition style codes and compatible with arcgis.js core library version **4.25**

## Getting started

Lets install vue-gis with npm

```
npm install --save @musasutisna/vue-gis
```

after install completed next load map into your vue component

```
<script setup>
import { VueGIS } from '@musasutisna/vue-gis'
</script>

<template>
  <div style="position: fixed;top: 0;right: 0;bottom: 0;left: 0;width: 100%;height: 100%;">
    <VueGIS />
  </div>
</template>
```

## Configuration

All configuration we setup inside a file json, all files is located by default at **src/public** in your vue directory. Create a new directory with name **map** to collected all setting files, in other hand all files located can be customize by override with these config

```
window.config = {
  MAP_URL_CONFIG: '/map',
  MAP_URL_CONFIG_FILE: '/config.json'
  MAP_URL_CATEGORY_FILE: '/category.json'
  MAP_URL_GROUP_FILE: '/group.json'
  MAP_URL_BASEMAP_FILE: '/basemap.json'
  MAP_URL_LAYER_FILE: '/layer.json'
  MAP_URL_LEGEND_FILE: '/legend.json'
}
```

## How to config (*config.json*)

config is how we control map display running

```
{
  "zoom": 5,
  "scale": 18000000,
  "center": [113.9213, -0.7893]
}
```

| Name | Type | Description |
|:--|:--|:--|
| zoom | Integer | Zoom level of map |
| scale | Integer | Scale level of map |
| center | Array | Central point of map |

## Categorizing Layer (*category.js*)

Make a base category for all our layer collection to help our developed all displayed layer make easier controled like toggle or removed.

| Name | Type | Description |
|:--|:--|:--|
| id | Integer | Unique id of category |
| name| String | Name of category |
| title | String | Title of category |
| order | Integer | Ordering category number |
| enable | Boolean | Set true to make category readable and false to skip category |

## Grouping Layer (*group.js*)

Make a base group for all our layer collection to help our developed all displayed layer make easier controled like toggle or removed.

| Name | Type | Description |
|:--|:--|:--|
| id | Integer | Unique id of group |
| name| String | Name of group |
| title | String | Title of group |
| order | Integer | Ordering group number |
| enable | Boolean | Set true to make group readable and false to skip group |
| icon | String | Url to image icon of group |

## How to setup basemap (*basemap.json*)

A basemap is a background map layer that provides context and reference information for the primary data being displayed on a map, these a example free basemap hosted by ArcGIS

```
[
  {
    "id": 1,
    "enable": true,
    "default": false,
    "title": "Satellite",
    "type": "BasemapId",
    "BasemapId": "satellite"
  },
  {
    "id": 2,
    "enable": true,
    "default": false,
    "title": "Hybrid",
    "type": "BasemapId",
    "BasemapId": "hybrid"
  },
  {
    "id": 3,
    "enable": true,
    "default": false,
    "title": "Oceans",
    "type": "BasemapId",
    "BasemapId": "oceans"
  },
  {
    "id": 4,
    "enable": true,
    "default": true,
    "title": "OSM",
    "type": "BasemapId",
    "BasemapId": "oceans"
  },
  {
    "id": 5,
    "enable": true,
    "default": false,
    "title": "Terrain",
    "type": "BasemapId",
    "BasemapId": "terrain"
  },
  {
    "id": 6,
    "enable": true,
    "default": false,
    "title": "Dark Gray",
    "type": "BasemapId",
    "BasemapId": "dark-gray-vector"
  },
  {
    "id": 7,
    "enable": true,
    "default": false,
    "title": "Gray",
    "type": "BasemapId",
    "BasemapId": "gray-vector"
  },
  {
    "id": 8,
    "enable": true,
    "default": false,
    "title": "Streets",
    "type": "BasemapId",
    "BasemapId": "streets-vector"
  },
  {
    "id": 9,
    "enable": true,
    "default": false,
    "title": "Streets Night",
    "type": "BasemapId",
    "BasemapId": "streets-night-vector"
  },
  {
    "id": 10,
    "enable": true,
    "default": false,
    "title": "Streets Navigation",
    "type": "BasemapId",
    "BasemapId": "streets-navigation-vector"
  },
  {
    "id": 11,
    "enable": true,
    "default": false,
    "title": "Topo",
    "type": "BasemapId",
    "BasemapId": "topo-vector"
  },
  {
    "id": 12,
    "enable": true,
    "default": false,
    "title": "Streets Relief",
    "type": "BasemapId",
    "BasemapId": "streets-relief-vector"
  }
]
```

Every item in basemap have a structure with this description

| Name | Type | Description |
|:--|:--|:--|
| id | Integer | Unique id of basemap layer |
| enable | Boolean | Set true to make basemap readable and false to skip basemap |
| default | Boolean | Set true to make a basemap as active layer on initial load |
| title | String | The title of basemap |
| type | String | Type of basemap (*BasemapId*, *WMTSLayer*) |
| BasemapId | String | https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap |
| WMTSLayer | Object | https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-WMTSLayer.html#properties-summary |

## How to setup layer (*layer.json*)

A layer is a distinct collection of geographic data that is displayed and managed together. Each layer represents a specific type of data, such as points, lines, polygons, or raster images, and can be visualized on top of a basemap or other layers to provide a comprehensive view of spatial information. A configuration layer can be setup with these structure.

| Name | Type | Description |
|:--|:--|:--|
| id | Integer | unique id of layer |
| category | String | Category of layer, selected one available in **category.json** |
| group | String | Group of layer, selected one available in **group.json** |
| enable | Boolean | Set true to make layer readable and false to skip layer |
| show | Boolean | Set true to make a layer initial load |
| title | String | The title of layer |
| type | String | Type of layer (*GeojsonLayer*, *WMSLayer*, *MapImageLayer*) |
| content | String | Type shown by layer (*image*, *line*, *point*) |
| permission | Array | The list permission allowed to *enable* the layer |
| zindex | Integer | The number of zindex layer |
| main_order | Integer | The number of ordering main layer |
| category_order | Integer | The number of ordering category layer |
| group_order | Integer | The number of ordering group layer |
| GeojsonLayer | Object | https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GeoJSONLayer.html |
| WMTSLayer | Object | https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-WMTSLayer.html |
| MapImageLayer | Object | https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-MapImageLayer.html |

## How to setup legend (*legend.json*)

A legend is a key that explains the symbols, colors, and patterns used on a map. It helps users understand what the various map elements represent, such as different types of roads, land use, water bodies, or elevation levels. Feel free to customize the legend format in these files.

| Name | Type | Description |
|:--|:--|:--|
| title | String | The title of legend |
| sub | Array | Collection of detailed legend items |
| sub[].name | String | Name of the legend item |
| sub[].symbol | String | URL to the symbol image |
| sub[].desc | String | Detailed description of the legend item |

## Custom parameters

Pre-processing custom parameters with supplied data and from executed method.

```
"customParameters": {
  "property_one": {
    "@lib": "toString",
    "@param": [{"one":1,"two":2,"there":3}, ":", ";"]
  },
  "propety_two": {
    "token": {
      "@lib": "sessionStorage",
      "@param": ["token"]
    }
  },
  "property_there": "there"
  "property_four": "four",
  "proeprty_five": { "$": "five" }
}
```

will produces

```
"customParameters": {
  "property_one": "one=1;two=2;there=3;",
  "property_two": "token saved in session storage",
  "property_there": "there",
  "property_four": "four",
  "property_five": 5
}
```

that format "@lib" is fill with method name availble on libs and "@param" is the arguments will be pass into method and "$" to access custom data supplied by generate parameter and all property without format will be normaled values.

## Custom parameters @lib

The lib is have reserved method could not be used "execute", but you can use following method in our custom parameter

### @lib: localStorage

Get a data from localStorage with key

```
Return: String
```

Parameters

| Name | Type | Description |
|:-|:-|:-|
| Name | String | The key will be get on localStorage |

### @lib: sessionStorage

Get a data from sessionStorage with key

```
Return: String
```

Parameters

| Name | Type | Description |
|:-|:-|:-|
| Name | String | The key will be get on sessionStorage |

### @lib: toString

Convert a object into string, and we could add assign and sparator

```
Return: String
```

Parameters

| Name | Type | Description |
|:-|:-|:-|
| Items | Array \| Object | Items will be convert into string |
| Assign | Boolean \| String | Assign value items with assign to index |
| Sparator | Boolean \| String | Sparator to chain every item |

### @lib: cast

Type casting of item

```
Return: Mixed
```

Parameters

| Name | Type | Description |
|:-|:-|:-|
| Item | Mixed | Item will be type casting |
| Type | String | The return type of item we want |

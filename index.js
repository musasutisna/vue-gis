import '@arcgis/core/assets/esri/themes/light/main.css'

// create config object if not exists
if (typeof window.config === 'undefined') {
  window.config = {}
}

window.config.MAP_URL_CONFIG = window.config.MAP_URL_CONFIG || '/map'
window.config.MAP_URL_CONFIG_FILE = window.config.MAP_URL_CONFIG_FILE || '/config.json'
window.config.MAP_URL_CATEGORY_FILE = window.config.MAP_URL_CATEGORY_FILE || '/category.json'
window.config.MAP_URL_GROUP_FILE = window.config.MAP_URL_GROUP_FILE || '/group.json'
window.config.MAP_URL_BASEMAP_FILE = window.config.MAP_URL_BASEMAP_FILE || '/basemap.json'
window.config.MAP_URL_LAYER_FILE = window.config.MAP_URL_LAYER_FILE || '/layer.json'
window.config.MAP_URL_LEGEND_FILE = window.config.MAP_URL_LEGEND_FILE || '/legend.json'

export { useMessageStore } from './stores/message'
export { useConfigStore } from './stores/config'
export { useCategoryStore } from './stores/category'
export { useGroupStore } from './stores/group'
export { useBasemapStore } from './stores/basemap'
export { useLayerStore } from './stores/layer'
export { useMapStore } from './stores/map'
export { default as VueGIS } from './Map.vue'

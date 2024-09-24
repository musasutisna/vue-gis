import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useMessageStore } from './message'
import { useConfigAPI } from './apis/config'
import { useMapStore } from './map'

export const useLayerStore = defineStore('vuegis_layer', () => {
  const message = useMessageStore()
  const configAPI = useConfigAPI()
  const map = useMapStore()

  const caches = {}
  const src = ref({})
  const categories = ref({})
  const groups = ref({})
  const sources = {}

  /**
   * Load layer file from server then set as src.
   *
   * @param   string
   * @param   mixed
   * @return  void
   */
  async function toLoadLayerFile(layerFile, layerOverride = null) {
    message.toToggleLoading({
      text: 'load map layers'
    })

    let layers = {}

    if (typeof caches[layerFile] === 'undefined') {
      const resultLayer = await configAPI.apiGET(layerFile)

      if (resultLayer && Array.isArray(resultLayer.data)) {
        layers = resultLayer.data
      } else {
        console.error(
          'vuegis.stores.layer.toLoadLayerFile: ',
          `could not load layer file ${layerFile}`
        )
      }
    } else {
      layers = caches[layerFile]
    }

    for (var l of layers) {
      let layer = {}

      if (layerOverride !== null) {
        if (typeof layerOverride[l.id] !== 'undefined') {
          layer = override(l, layerOverride[l.id])
        }
      } else {
        layer = { ...l }
      }

      if (!layer.enable) continue

      if (typeof categories.value[layer.category] === 'undefined') {
        categories.value[layer.category] = []
      }

      if (typeof groups.value[layer.group] === 'undefined') {
        groups.value[layer.group] = []
      }

      src.value[layer.id] = layer

      categories.value[layer.category][layer.category_order] = layer
      groups.value[layer.group][layer.group_order] = layer
    }

    message.toToggleLoading({ display: false })
  }

  /**
   * Override layer config.
   *
   * @param   object
   * @param   object
   * @return  object
   */
  function override(layer, layerOverride) {
    for (var overrideIndex in layerOverride) {
      if (typeof layerOverride[overrideIndex] === 'object' &&
        layerOverride[overrideIndex] !== null) {
        layer[overrideIndex] = override(layer[overrideIndex], layerOverride[overrideIndex])
      } else {
        layer[overrideIndex] = layerOverride[overrideIndex]
      }
    }

    return layer
  }

  /**
   * Toggle visible selected layer or load if source not exists.
   *
   * @param   object
   * @return  object
   */
  async function toggleLayer({
    layerId = null,
    force = null,
    $data = {}
  }) {
    src.value[layerId].show = force !== null ? force : !src.value[layerId].show

    if (sources[layerId]) {
      sources[layerId].visible = src.value[layerId].show
    } else if (src.value[layerId].show) {
      sources[layerId] = await map.toLoadLayer(src.value[layerId], $data)
    }

    return sources[layerId]
  }

  /**
   * To load all layer with enable is true.
   *
   * @param   number
   * @return  void
   */
  async function toLoadEnableLayer() {
    for (var layerId in src.value) {
      if (src.value[layerId].show) {
        sources[layerId] = await map.toLoadLayer(src.value[layerId])
      }
    }
  }

  /**
   * To remove layer source and from map view.
   *
   * @param   string
   * @return  void
   */
  function toRemoveLayer(layerId) {
    let layerCategory = src.value[layerId].category
    let layerCategoryOrder = src.value[layerId].category_order
    let layerGroup = src.value[layerId].group
    let layerGroupOrder = src.value[layerId].group_order

    delete src.value[layerId]
    delete categories.value[layerCategory].splice(layerCategoryOrder, 1)
    delete groups.value[layerGroup].splice(layerGroupOrder, 1)

    if (categories.value[layerCategory].length < 1) {
      delete categories.value[layerCategory]
    }

    if (groups.value[layerGroup].length < 1) {
      delete groups.value[layerGroup]
    }

    if (typeof sources[layerId] !== 'undefined') {
      map.toRemoveLayer(sources[layerId])

      delete sources[layerId]
    }
  }

  /**
   * Searching feature on layer.
   *
   * @param   string
   * @param   object
   * @param   function
   * @return  mixed
   */
  async function toSearch(layerId, query, cb) {
    if (sources[layerId]) {
      try {
        sources[layerId].queryFeatureCount(query)
          .then((resultNum) => {
            sources[layerId].queryFeatures(query)
              .then((resultObj) => {
                cb(resultNum, resultObj)
              })
          })
      } catch (err) {
        console.error(
          'vuegis.stores.layer.toSearch: ',
          `could not perform search on layer ${layerId}`
        )

        cb(null)
      }
    }
  }

  return {
    src,
    toLoadLayerFile,
    toggleLayer,
    toLoadEnableLayer,
    toRemoveLayer,
    toSearch
  }
})

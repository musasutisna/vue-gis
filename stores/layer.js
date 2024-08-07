import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useMessageStore } from './message'
import { useConfigAPI } from './apis/config'
import { useMapStore } from './map'

export const useLayerStore = defineStore('vuegis_layer', () => {
  const message = useMessageStore()
  const configAPI = useConfigAPI()
  const map = useMapStore()

  const src = ref({})
  const categories = ref({})
  const groups = ref({})
  const sources = ref({})

  /**
   * Load layer file from server then set as src.
   *
   * @return  void
   */
  async function toLoadLayerFile() {
    message.toToggleLoading({
      text: 'load map layers'
    })

    const resultLayer = await configAPI.apiGET(window.config.MAP_URL_LAYER_FILE)

    if (resultLayer && Array.isArray(resultLayer.data)) {
      src.value = {}

      for (var layer of resultLayer.data) {
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
    } else {
      console.error(
        'vuegis.stores.config.toLoadLayerFile: ',
        `could not load layer file ${window.config.MAP_URL_LAYER_FILE}`
      )
    }

    message.toToggleLoading({ display: false })
  }

  /**
   * Toggle visible selected layer or load if source not exists.
   *
   * @param   number
   * @param   boolean
   * @return  void
   */
  async function toggleLayer(layerId, force = null) {
    src.value[layerId].show = force !== null ? force : !src.value[layerId].show

    if (sources.value[layerId]) {
      sources.value[layerId].visible = src.value[layerId].show
    } else if (src.value[layerId].show) {
      sources.value[layerId] = await map.toLoadLayer(src.value[layerId])
    }
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
        sources.value[layerId] = await map.toLoadLayer(src.value[layerId])
      }
    }
  }

  return {
    src,
    toLoadLayerFile,
    toggleLayer,
    toLoadEnableLayer
  }
})

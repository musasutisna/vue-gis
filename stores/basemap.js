import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useMessageStore } from './message'
import { useConfigAPI } from './apis/config'
import { useMapStore } from './map'

export const useBasemapStore = defineStore('vuegis_basemap', () => {
  const message = useMessageStore()
  const configAPI = useConfigAPI()
  const map = useMapStore()

  const src = ref({})
  const active = ref({})
  const initial = ref({})

  /**
   * Load basemap file from server then set as src.
   *
   * @return  void
   */
  async function toLoadBasemapFile() {
    message.toToggleLoading({
      text: 'load basemap'
    })

    const resultBasemap = await configAPI.apiGET(window.config.MAP_URL_BASEMAP_FILE)

    if (resultBasemap && Array.isArray(resultBasemap.data)) {
      for (var basemap of resultBasemap.data) {
        src.value[basemap.id] = basemap
      }
    } else {
      console.error(
        'vuegis.stores.basemap.toLoadBasemapFile: ',
        `could not load basemap file ${window.config.MAP_URL_BASEMAP_FILE}`
      )
    }

    message.toToggleLoading({ display: false })
  }

  /**
   * Set basemap with default as initial map.
   *
   * @return  mixed
   */
  function getInitialBasemap() {
    if (initial.id) return initial.value

    for (var basemapId in src.value) {
      if (src.value[basemapId].default) {
        initial.value = src.value[basemapId]

        return initial.value
      }
    }

    return null
  }

  /**
   * Set selected basemap with id to active basemap.
   *
   * @param   number
   * @return  void
   */
  async function setActiveBasemap(basemapId) {
    if (src.value[basemapId]) {
      active.value = src.value[basemapId]
    }
  }

  /**
   * Load default basemap.
   *
   * @return  void
   */
  async function toLoadDefaultBasemap() {
    const initialBasemap = getInitialBasemap()

    if (initialBasemap) {
      setActiveBasemap(initialBasemap.id)

      await map.setBasemap(initialBasemap)
    }
  }

  return {
    src,
    active,
    initial,
    toLoadBasemapFile,
    getInitialBasemap,
    setActiveBasemap,
    toLoadDefaultBasemap
  }
})

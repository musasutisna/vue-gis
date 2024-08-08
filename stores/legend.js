import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useMessageStore } from './message'
import { useConfigAPI } from './apis/config'

export const useLegendStore = defineStore('vuegis_legend', () => {
  const message = useMessageStore()
  const configAPI = useConfigAPI()

  const src = ref()

  /**
   * Load legend file from server then set as src.
   *
   * @return  void
   */
  async function toLoadLegendFile() {
    message.toToggleLoading({
      text: 'load map legends'
    })

    const resultLegend = await configAPI.apiGET(window.config.MAP_URL_LEGEND_FILE)

    if (resultLegend && Array.isArray(resultLegend.data)) {
      src.value = {}

      for (var legend of resultLegend.data) {
        src.value[legend.id] = legend
      }
    } else {
      console.error(
        'vuegis.stores.config.toLoadLegendFile: ',
        `could not load legend file ${window.config.MAP_URL_LEGEND_FILE}`
      )
    }

    message.toToggleLoading({ display: false })
  }

  return {
    src,
    toLoadLegendFile
  }
})

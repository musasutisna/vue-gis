import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useMessageStore } from './message'
import { useConfigAPI } from './apis/config'

export const useConfigStore = defineStore('vuegis_config', () => {
  const message = useMessageStore()
  const configAPI = useConfigAPI()

  const src = ref({})

  /**
   * Load config file from server then set as src.
   *
   * @return  void
   */
  async function toLoadConfigFile() {
    message.toToggleLoading({
      text: 'load map config'
    })

    const resultConfig = await configAPI.apiGET(window.config.MAP_URL_CONFIG_FILE)

    if (resultConfig && typeof resultConfig === 'object') {
      src.value = resultConfig.data
    } else {
      console.error(
        'vuegis.stores.config.toLoadConfigFile: ',
        `could not load config file ${window.config.MAP_URL_CONFIG_FILE}`
      )
    }

    message.toToggleLoading({ display: false })
  }

  return {
    src,
    toLoadConfigFile
  }
})

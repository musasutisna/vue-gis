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

  /**
   * Esri config handler.
   */
  const handler = {}

  /**
   * Handler to parsing config request.
   *
   * @param   object
   * @param   object
   * @return  void
   */
  handler.request = function (EsriConfig, request) {
    if (request.interceptors && Array.isArray(request.interceptors)) {
      for (var interceptIndex in request.interceptors) {
        const intercept = request.interceptors[interceptIndex]
        const headers = intercept.headers || {}

        EsriConfig.request.interceptors.push({
          urls: intercept.urls,
          before: (params) => {
            params.requestOptions.headers = headers
          }
        })
      }
    } else {
      console.error(
        'vuegis.stores.config.handler.request: could not set interceptors'
      )
    }
  }

  return {
    src,
    toLoadConfigFile,
    handler
  }
})

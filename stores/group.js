import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useMessageStore } from './message'
import { useConfigAPI } from './apis/config'

export const useGroupStore = defineStore('vuegis_group', () => {
  const message = useMessageStore()
  const configAPI = useConfigAPI()

  const src = ref()

  /**
   * Load group file from server then set as src.
   *
   * @return  void
   */
  async function toLoadGroupFile() {
    message.toToggleLoading({
      text: 'load map groups'
    })

    const resultGroup = await configAPI.apiGET(window.config.MAP_URL_GROUP_FILE)

    if (resultGroup && Array.isArray(resultGroup.data)) {
      src.value = {}

      for (var group of resultGroup.data) {
        src.value[group.id] = group
      }
    } else {
      console.error(
        'vuegis.stores.config.toLoadGroupFile: ',
        `could not load group file ${window.config.MAP_URL_GROUP_FILE}`
      )
    }

    message.toToggleLoading({ display: false })
  }

  return {
    src,
    toLoadGroupFile
  }
})

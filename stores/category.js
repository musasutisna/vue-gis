import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useMessageStore } from './message'
import { useConfigAPI } from './apis/config'

export const useCategoryStore = defineStore('vuegis_category', () => {
  const message = useMessageStore()
  const configAPI = useConfigAPI()

  const src = ref()

  /**
   * Load category file from server then set as src.
   *
   * @return  void
   */
  async function toLoadCategoryFile() {
    message.toToggleLoading({
      text: 'load map categories'
    })

    const resultCategory = await configAPI.apiGET(window.config.MAP_URL_CATEGORY_FILE)

    if (resultCategory && Array.isArray(resultCategory.data)) {
      src.value = {}

      for (var category of resultCategory.data) {
        src.value[category.id] = category
      }
    } else {
      console.error(
        'vuegis.stores.category.toLoadCategoryFile: ',
        `could not load category file ${window.config.MAP_URL_CATEGORY_FILE}`
      )
    }

    message.toToggleLoading({ display: false })
  }

  return {
    src,
    toLoadCategoryFile
  }
})

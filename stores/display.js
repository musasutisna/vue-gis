import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useDisplayStore = defineStore('Display', () => {
  const list = reactive({})

  function toggle(key, force = null) {
    list[key] = force !== null ? force : !list[key]
  }

  return {
    list,
    toggle
  }
})

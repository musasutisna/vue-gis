import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMessageStore = defineStore('Message', () => {
  const loading = ref({
    display: false,
    text: null,
    icon: false
  })

  const warning = ref({
    display: false,
    close: false,
    icon: null,
    text: null
  })

  function toToggleLoading({
    display = true,
    text = null,
    icon = true
  } = {}) {
    loading.value.display = display
    loading.value.text = text
    loading.value.icon = icon
  }

  function toToggleWarning({
    display = true,
    close = null,
    icon = null,
    text = null
  } = {}) {
    warning.value.display = display
    warning.value.close = close
    warning.value.icon = icon

    if (text instanceof Object) {
      let newText = ''

      for (var msg of text) {
        newText += `${msg.msg || ''}<br/>`
      }

      text = newText
    }

    warning.value.text = text
  }

  return {
    loading,
    warning,
    toToggleLoading,
    toToggleWarning
  }
})

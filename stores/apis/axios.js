import { useMessageStore } from '../message'

export default function (api, defaultConfig = null) {
  const message = useMessageStore()

  function combineWithDefaultConfig(config) {
    var newConfig = {}

    if (defaultConfig instanceof Object) {
      newConfig = { ...defaultConfig }
    }

    if (config instanceof Object) {
      newConfig = { ...newConfig, ...config }
    }

    return newConfig
  }

  async function apiGET(url, config = null, showErr = true) {
    let result = null

    config = combineWithDefaultConfig(config)

    try {
      result = await api.get(url, config)
    } catch (err) {
      result = false

      if (showErr) {
        if (err.response) {
          message.toToggleWarning({
            display: true,
            close: true,
            icon: 'warning',
            text: err.response.data?.message || err.message
          })
        }
      }
    }

    return result
  }

  async function apiPOST(url, data = null, config = null, showErr = true) {
    let result = null

    try {
      result = await api.post(url, data, config)
    } catch (err) {
      result = false

      if (showErr) {
        if (err.response) {
          message.toToggleWarning({
            display: true,
            text: err.response.data?.message || err.message
          })
        }
      }
    }

    return result
  }

  async function apiPUT(url, data = null, config = null, showErr = true) {
    let result = null

    try {
      result = await api.put(url, data, config)
    } catch (err) {
      result = false

      if (showErr) {
        if (err.response) {
          message.toToggleWarning({
            display: true,
            text: err.response.data?.message || err.message
          })
        }
      }
    }

    return result
  }

  async function apiDELETE(url, config = null, showErr = true) {
    let result = null

    try {
      result = await api.delete(url, config)
    } catch (err) {
      result = false

      if (showErr) {
        if (err.response) {
          message.toToggleWarning({
            display: true,
            text: err.response.data?.message || err.message
          })
        }
      }
    }

    return result
  }

  return {
    apiGET,
    apiPOST,
    apiPUT,
    apiDELETE
  }
}

import { defineStore } from 'pinia'
import moment from 'moment'

export const useCustomparamStore = defineStore('vuegis_customparam', () => {
  /**
   * List available method can be call.
   */
  const libs = {
    execute: (items, $data) => {
      let result = null

      if (items !== null) {
        if (typeof items === 'object' && typeof items["@lib"] !== 'undefined') {
          if (typeof items["@params"] !== 'undefined') {
            const params = []

            for (var paramIndex in items["@params"]) {
              params[paramIndex] = libs.execute(items["@params"][paramIndex], $data)
            }

            result = libs[items["@lib"]](...(params))
          } else {
            result = libs[items["@lib"]]($data)
          }
        } else if (typeof items === 'object' && typeof items["$"] !== 'undefined') {
          result = $data[items["$"]]
        } else if (typeof items === 'object') {
          result = Array.isArray(items) ? [] : {}

          for (var itemIndex in items) {
            result[itemIndex] = libs.execute(items[itemIndex], $data)
          }
        } else {
          result = items
        }
      }

      return result
    },
    localStorage: (name) => {
      return window.localStorage.getItem(name)
    },
    sessionStorage: (name) => {
      return window.sessionStorage.getItem(name)
    },
    toString: (items, prefix = false, suffix = false, assign = false, sparator = false) => {
      let result = ''
      let total = 0

      for (var itemIndex in items) {
        if (sparator && total > 0) {
          result += sparator
        }

        result += `${itemIndex}${assign || ''}${prefix || ''}${items[itemIndex]}${suffix || ''}`
        total += 1
      }

      return result
    },
    cast: (item, type) => {
      if (type === 'int') return parseInt(item)
      else if (type === 'float') return parseFloat(item)
      else if (type === 'string') return (item)?.toString || item

      return item
    },
    moment: (datetime, items) => {
      let result = moment(datetime || undefined)

      for (var momentMethod in items) {
        if (result[momentMethod]) {
          if (items[momentMethod]) {
            result = result[momentMethod](...(items[momentMethod]))
          } else {
            result = result[momentMethod]()
          }
        }
      }

      return result
    }
  }

  /**
   * Pre-processing custom parameters with supplied data
   * and from executed method.
   * 
   * ------------------------------------------------------
   * "property_one": {
   *   "@lib": "toString",
   *   "@param": [{"one":1,"two":2,"there":3}, ":", ";"]
   * },
   * "propety_two": {
   *   "token": {
   *     "@lib": "sessionStorage",
   *     "@param": ["token"]
   *   }
   * },
   * "property_there": "there"
   * "property_four": "four",
   * "proeprty_five": { "$": "five" }
   * ------------------------------------------------------
   * will produces
   * ------------------------------------------------------
   * "property_one": "one=1;two=2;there=3;",
   * "property_two": "token saved in session storage",
   * "property_there": "there",
   * "property_four": "four",
   * "property_five": 5
   * ------------------------------------------------------
   * 
   * that format "@lib" is fill with method name availble on libs
   * and "@param" is the arguments will be pass into method
   * and "$" to access custom data supplied by generate parameter
   * and all property without format will be normaled values
   *
   * @return  object
   */
  function generate(customparams, $data) {
    return libs.execute(customparams, $data)
  }

  return {
    generate
  }
})

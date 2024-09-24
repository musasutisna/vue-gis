import { defineStore } from 'pinia'
import EsriConfig from '@arcgis/core/config'
import EsriMap from '@arcgis/core/Map'
import EsriMapView from '@arcgis/core/views/MapView'
import EsriBasemap from '@arcgis/core/Basemap'
import EsriWMTSLayer from '@arcgis/core/layers/WMTSLayer'
import EsriGeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer'
import EsriWMSLayer from '@arcgis/core/layers/WMSLayer'
import EsriMapImageLayer from '@arcgis/core/layers/MapImageLayer'
import EsriGraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import { useConfigStore } from './config'
import { useCustomparamStore } from './customparam'

export const useMapStore = defineStore('vuegis_map', () => {
  const config = useConfigStore()
  const customparam = useCustomparamStore()

  /**
   * Arcgis installed configuration.
   *
   * @map         Instance of arcgis map.
   * @view        Instance of arcgis map viewer for interactive web map.
   * @widgets     Collection instance of arcgis widget.
   */
  const arcgis = {
    map: null,
    view: null,
    widgets: {}
  }

  /**
   * Initialize map.
   *
   * @param   DOM     dom container will be inject arcgis map
   * @return  void
   */
  async function toInitMap(domMap) {
    // setup esri config
    if (config.src.EsriConfig) {
      config.src.EsriConfig = customparam.generate(config.src.EsriConfig, {})

      for (var esriConfigProp in config.src.EsriConfig) {
        if (config.handler[esriConfigProp]) {
          config.handler[esriConfigProp](EsriConfig, config.src.EsriConfig[esriConfigProp])
        } else {
          EsriConfig[esriConfigProp] = config.src.EsriConfig[esriConfigProp]
        }
      }
    }

    // set map width by actual parent map
    domMap.style.width = `${domMap.parentNode.offsetWidth}px`
    domMap.style.height = `${domMap.parentNode.offsetHeight}px`

    arcgis.map = new EsriMap({
      layers: []
    })

    arcgis.view = new EsriMapView({
      container: domMap,
      map: arcgis.map,
      zoom: config.src.MapView.zoom,
      scale: config.src.MapView.scale,
      center: config.src.MapView.center,
      ui: {
        components: [
          'attribution'
        ]
      }
    })

    window.addEventListener('resize', (e) => {
      // set map width first by actual parent map
      domMap.style.width = `${domMap.parentNode.offsetWidth}px`
      domMap.style.height = `${domMap.parentNode.offsetHeight}px`
    })
  }

  /**
   * Apply basemap to current map.
   *
   * @param   object
   * @return  void
   */
  async function setBasemap(basemapConfig) {
    arcgis.map.basemap = await toLoadBasemap(basemapConfig)
  }

  /**
   * Load basemap config.
   *
   * @param   object
   * @return  mixed
   */
  async function toLoadBasemap(basemapConfig) {
    if (basemapConfig.type === 'WMTSLayer') {
      return new EsriBasemap({
        baseLayers: [
          new EsriWMTSLayer(basemapConfig.WMTSLayer)
        ]
      })
    } else if (basemapConfig.type === 'BasemapId') {
      return basemapConfig.BasemapId
    }
  }

  /**
   * To load layer and add into map.
   *
   * @param   object
   * @param   object
   * @return  object
   */
  async function toLoadLayer(layerConfig, $data = {}) {
    let layerSource = null

    if (layerConfig.type === 'GeojsonLayer') {
      const config = {
        ...layerConfig.GeojsonLayer
      }

      if (layerConfig.GeojsonLayer.customParameters) {
        config.customParameters = customparam.generate(
          layerConfig.GeojsonLayer.customParameters,
          $data
        )
      }

      layerSource = new EsriGeoJSONLayer(config)
    } else if (layerConfig.type === 'WMSLayer') {
      const config = {
        ...layerConfig.WMSLayer
      }

      if (layerConfig.WMSLayer.customParameters) {
        config.customParameters = customparam.generate(
          layerConfig.WMSLayer.customParameters,
          $data
        )
      }

      layerSource = new EsriWMSLayer(config)
    } else if (layerConfig.type === 'MapImageLayer') {
      const config = {
        ...layerConfig.MapImageLayer
      }

      if (layerConfig.MapImageLayer.customParameters) {
        config.customParameters = customparam.generate(
          layerConfig.MapImageLayer.customParameters,
          $data
        )
      }

      layerSource = new EsriMapImageLayer(config)
    } else if (layerConfig.type === 'GraphicsLayer') {
      const config = {
        ...layerConfig.GraphicsLayer
      }

      layerSource = new EsriGraphicsLayer(config)
    }

    if (layerSource) {
      await layerSource.load()

      toAddLayer(layerSource, layerConfig.zindex)
    }

    return layerSource
  }

  /**
   * To add layer into map.
   *
   * @param   object
   * @param   number
   * @return  void
   */
  function toAddLayer(layerSource, zindex = null) {
    arcgis.map.add(layerSource, zindex)
  }

  /**
   * To remove layer from map.
   *
   * @param   object
   * @return  void
   */
  function toRemoveLayer(layerSource) {
    arcgis.map.remove(layerSource)
  }

  /**
   * To add widget into map view ui.
   *
   * @param   object
   * @return  mixed
   */
  function toAddWidget({
    id = null,
    widget = null,
    config = {},
    options = {}
  }) {
    if (widget) {
      config.view = arcgis.view
      arcgis.widgets[id] = new widget(config)
  
      arcgis.view.ui.add(arcgis.widgets[id], options)

      return arcgis.widgets[id]
    }

    return null
  }

  /**
   * To remove widget from map view ui.
   *
   * @param   string
   * @return  void
   */
  function toRemoveWidget(widgetId) {
    arcgis.view.ui.remove(arcgis.widgets[widgetId])

    delete arcgis.widgets[widgetId]
  }

  /**
   * To custom popup.
   *
   * @param   object
   * @return  void
   */
  function toCustomPopup({ popupEnabled = false, dockEnabled = false, dockOptions = {} }) {
    arcgis.view.popupEnabled = popupEnabled
    arcgis.view.popup = {
      dockEnabled,
      dockOptions
    }
  }

  /**
   * To add event into map view.
   *
   * @param   string
   * @param   function
   * @return  void
   */
  function toAddEvent(eventName, cb) {
    arcgis.view.on(eventName, function (e) {
      cb(e, arcgis)
    })
  }

  /**
   * To add watch listener into map view.
   *
   * @param   string
   * @param   function
   * @return  void
   */
  function toAddWatch(eventName, cb) {
    arcgis.view.watch(eventName, function (e) {
      cb(e, arcgis)
    })
  }

  /**
   * Move view to target.
   *
   * @param   object
   * @param   object
   * @return  void
   */
  function toGoTo(target, options) {
    arcgis.view.goTo(target, options)
  }

  /**
   * Interact with view method.
   *
   * @param   string
   * @param   object
   * @return  mixed
   */
  function toViewMethod(method, args = []) {
    return arcgis.view[method](...(args))
  }

  /**
   * Interact with view ui method.
   *
   * @param   string
   * @param   object
   * @return  mixed
   */
  function toUIMethod(method, args = []) {
    return arcgis.view.ui[method](...(args))
  }

  return {
    toInitMap,
    setBasemap,
    toLoadLayer,
    toAddLayer,
    toRemoveLayer,
    toAddWidget,
    toRemoveWidget,
    toCustomPopup,
    toAddEvent,
    toAddWatch,
    toGoTo,
    toViewMethod,
    toUIMethod
  }
})

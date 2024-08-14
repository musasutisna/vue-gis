import { defineStore } from 'pinia'
import EsriMap from '@arcgis/core/Map'
import EsriMapView from '@arcgis/core/views/MapView'
import EsriBasemap from '@arcgis/core/Basemap'
import EsriWMTSLayer from '@arcgis/core/layers/WMTSLayer'
import EsriGeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer'
import EsriWMSLayer from '@arcgis/core/layers/WMSLayer'
import EsriMapImageLayer from '@arcgis/core/layers/MapImageLayer'
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
   * @layers      Collection instance of arcgis layer.
   */
  const arcgis = {
    map: null,
    view: null
  }

  /**
   * Initialize map.
   *
   * @param   DOM     dom container will be inject arcgis map
   * @return  void
   */
  async function toInitMap(domMap) {
    // set map width by actual parent map
    domMap.style.width = `${domMap.parentNode.offsetWidth}px`
    domMap.style.height = `${domMap.parentNode.offsetHeight}px`

    arcgis.map = new EsriMap({
      layers: []
    })

    arcgis.view = new EsriMapView({
      container: domMap,
      map: arcgis.map,
      zoom: config.src.zoom,
      scale: config.src.scale,
      center: config.src.center,
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
  async function setBasemap (basemapConfig) {
    arcgis.map.basemap = await toLoadBasemap(basemapConfig)
  }

  /**
   * Load basemap config.
   *
   * @param   object
   * @return  mixed
   */
  async function toLoadBasemap (basemapConfig) {
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
   * @return  object
   */
  async function toLoadLayer (layerConfig) {
    let layerSource = null

    if (layerConfig.type === 'GeojsonLayer') {
      const config = {
        ...layerConfig.GeojsonLayer,
        customParameters: customparam.generate(layerConfig.GeojsonLayer.customParameters)
      }

      layerSource = new EsriGeoJSONLayer(config)
    } else if (layerConfig.type === 'WMSLayer') {
      const config = {
        ...layerConfig.WMSLayer,
        customParameters: customparam.generate(layerConfig.WMSLayer.customParameters)
      }

      layerSource = new EsriWMSLayer(config)
    } else if (layerConfig.type === 'MapImageLayer') {
      const config = {
        ...layerConfig.MapImageLayer,
        customParameters: customparam.generate(layerConfig.MapImageLayer.customParameters)
      }

      layerSource = new EsriMapImageLayer(config)
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
  function toAddLayer (layerSource, zindex = null) {
    arcgis.map.add(layerSource, zindex)
  }

  /**
   * To remove layer from map.
   *
   * @param   object
   * @return  void
   */
  function toRemoveLayer (layerSource) {
    arcgis.map.remove(layerSource)
  }

  /**
   * To add widget into map view ui.
   *
   * @param   object
   * @param   object
   * @param   object
   * @return  void
   */
  function toAddWidget(widget, config, options) {
    config.view = arcgis.view

    arcgis.view.ui.add(new widget(config), options)
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

  return {
    toInitMap,
    setBasemap,
    toLoadLayer,
    toAddLayer,
    toRemoveLayer,
    toAddWidget,
    toCustomPopup,
    toAddEvent,
    toAddWatch,
    toGoTo
  }
})

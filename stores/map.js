import { defineStore } from 'pinia'
import EsriMap from '@arcgis/core/Map'
import EsriMapView from '@arcgis/core/views/MapView'
import EsriBasemap from '@arcgis/core/Basemap'
import EsriWMTSLayer from '@arcgis/core/layers/WMTSLayer'
import EsriGeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer'
import EsriWMSLayer from '@arcgis/core/layers/WMSLayer'
import EsriMapImageLayer from '@arcgis/core/layers/MapImageLayer'
import EsriLocate from '@arcgis/core/widgets/Locate'
import EsriScaleBar from '@arcgis/core/widgets/ScaleBar'
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
   * @layers      Instance of arcgis map viewer for interactive web map.
   * @hitResult   Current selected object point
   * @location    Plugin to interact with location
   */
  const arcgis = {
    map: null,
    view: null,
    hitResult: null,
    location: null
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

    // Allow to interact with location
    arcgis.location = new EsriLocate({
      view: arcgis.view,
      iconClass: 'esri-icon-navigation'
    })

    // Adding scalebar into map
    const scaleBar = new EsriScaleBar({
      view: arcgis.view,
      visible: true,
      unit: 'metric',
      style: 'line'
    })

    arcgis.view.ui.add(scaleBar, {
      position: 'bottom-left'
    })

    // Handling map events
    arcgis.view.on('click', onClick)

    arcgis.view.watch('updating', (updating) => {
      if (updating) {
        // in updating
      } else {
        // update completed
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
   * Events trigger when click.
   *
   * @param   object
   * @return  void
   */
  function onClick(e) {
    arcgis.view.hitTest(e).then(async (response) => {
      const hitResult = response.results[0]

      if (typeof hitResult !== 'undefined' && hitResult.type === 'graphic') {
        arcgis.hitResult = hitResult
      }
    })
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

  return {
    arcgis,
    toInitMap,
    setBasemap,
    toLoadLayer,
    toAddLayer,
    toRemoveLayer
  }
})

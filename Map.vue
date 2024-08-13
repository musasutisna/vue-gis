<script setup>
import { onMounted, ref } from 'vue'
import { useConfigStore } from './stores/config.js'
import { useCategoryStore } from './stores/category.js'
import { useGroupStore } from './stores/group.js'
import { useBasemapStore } from './stores/basemap.js'
import { useLayerStore } from './stores/layer.js'
import { useLegendStore } from './stores/legend.js'
import { useMapStore } from './stores/map.js'

const emit = defineEmits(['ready'])

const config = useConfigStore()
const category = useCategoryStore()
const group = useGroupStore()
const basemap = useBasemapStore()
const layer = useLayerStore()
const legend = useLegendStore()
const map = useMapStore()
const domMap = ref(null)

onMounted(async () => {
  await config.toLoadConfigFile()
  await category.toLoadCategoryFile()
  await group.toLoadGroupFile()
  await basemap.toLoadBasemapFile()
  await layer.toLoadLayerFile()
  await map.toInitMap(domMap.value)
  await basemap.toLoadDefaultBasemap()
  await layer.toLoadEnableLayer()
  await legend.toLoadLegendFile()

  emit('ready')
})
</script>

<template>
  <div style="width: 100%;height: 100%;">
    <div ref="domMap"></div>
  </div>
</template>

<style>
/* remove border outline map */
.esri-view {
  --esri-view-outline-color: none !important;
  --esri-view-outline: 0;
  --esri-view-outline-offset: 0;
}
</style>

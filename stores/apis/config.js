import axios from 'axios'
import { defineStore } from 'pinia'
import Axios from './axios'

export const useConfigAPI = defineStore('vuegis_configapi', () => {
  const config = axios.create({
    baseURL: window.config.MAP_URL_CONFIG
  })

  return Axios(config)
})

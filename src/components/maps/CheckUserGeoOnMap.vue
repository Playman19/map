<template>
    <div>
        <div ref="map" class="map"></div>
    </div>
</template>
<script>
import 'ol/ol.css'; // Импорт стилей OpenLayers
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj'; // Импортируем функцию для преобразования координат
import Feature from 'ol/Feature'; // Импортируем класс Feature
import Point from 'ol/geom/Point'; // Импортируем класс Point
import VectorLayer from 'ol/layer/Vector'; // Импортируем класс VectorLayer
import VectorSource from 'ol/source/Vector'; // Импортируем класс VectorSource
import Style from 'ol/style/Style'; // Импортируем класс Style
import Circle from 'ol/style/Circle'; // Импортируем класс Circle
import Fill from 'ol/style/Fill'; // Импортируем класс Fill
import Stroke from 'ol/style/Stroke'; // Импортируем класс Stroke
import { getLocationInfo } from './mapMethods';


export default {
  name: 'MapComponent',
  created() {
    this.getUserCoords()
  },
  methods: {
    initMap(coords) {
      const userCoords = coords; // Получаем случайные координаты

      const map = new Map({
        target: this.$refs.map,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat(userCoords), // Преобразуем случайные координаты
          zoom: 13,
        }),
      });

      this.addMarker(map, userCoords); // Добавляем маркер на карту
    },

    addMarker(map, coords) {
      const feature = new Feature({
        geometry: new Point(fromLonLat(coords)),
      });

      feature.setStyle(new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: 'white' }), // Цвет маркера
          stroke: new Stroke({ color: 'red', width: 3 }) // Обводка маркера
        }),
      }));

      const vectorSource = new VectorSource({
        features: [feature], // Добавляем маркер в источник
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      map.addLayer(vectorLayer); // Добавляем слой с маркерами на карту
    },
    async getUserCoords() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    console.log(coords);
                    this.initMap([coords.longitude, coords.latitude]);
                    this.getUserLocInfo(coords.latitude, coords.longitude)
                },
                (error) => {
                    console.error(error);
                }
            );
        } 
        else {
            console.error('geolocation is not supported in you device');
        }
    },
    async getUserLocInfo(lat, lon) {
        const info = await getLocationInfo(lat,lon)
        console.log(info)
    }
  },
};
</script>
<style>
    
</style>
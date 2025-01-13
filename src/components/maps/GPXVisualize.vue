<template>
    <div ref="map" class="map"></div>
  </template>
  
  <script>
  import 'ol/ol.css'; // Импорт стилей OpenLayers
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import { fromLonLat } from 'ol/proj'; // Импортируем функцию для преобразования координат
  import LineString from 'ol/geom/LineString'; // Импортируем класс LineString
  import Feature from 'ol/Feature'; // Импортируем класс Feature
  import VectorLayer from 'ol/layer/Vector'; // Импортируем класс VectorLayer
  import VectorSource from 'ol/source/Vector'; // Импортируем класс VectorSource
  import Style from 'ol/style/Style'; // Импортируем класс Style
  import Stroke from 'ol/style/Stroke'; // Импортируем класс Stroke
  import GPXParser from 'gpxparser'; // Импортируем GPXParser
  
  export default {
    name: 'GPXVisualize',
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        const map = new Map({
          target: this.$refs.map,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          view: new View({
            // center: fromLonLat([0, 0]), // Пример координат
            zoom: 13,
          }),
        });
  
        this.loadGPX(map, '/new.gpx'); // Укажите путь к вашему GPX файлу
      },
  
      loadGPX(map, gpxFilePath) {
        fetch(gpxFilePath)
          .then(response => response.text())
          .then(data => {
            const gpx = new GPXParser(); // Создаем новый экземпляр GPXParser
            gpx.parse(data); // Парсим GPX данные из строки
            console.log(gpx.tracks);
            this.addGPXTracksToMap(gpx.tracks, map); // Добавляем треки на карту
            this.centerMapOnTrack(gpx.tracks, map);
          })
          .catch(error => console.error('Ошибка загрузки GPX файла:', error));
      },
  
      addGPXTracksToMap(tracks, map) {
        const vectorSource = new VectorSource();

        tracks.forEach(track => {
            // Извлекаем координаты из points
            const coords = track.points.map(point => fromLonLat([point.lon, point.lat]));
            
            // Проверяем, что координаты не пустые
            if (coords.length > 0) {
            const lineString = new LineString(coords);
            
            const feature = new Feature(lineString);
            feature.setStyle(new Style({
                stroke: new Stroke({
                color: 'blue',
                width: 2,
                }),
            }));

            vectorSource.addFeature(feature); // Добавляем трек в источник
            } else {
            console.warn('Трек не содержит точек:', track);
            }
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        map.addLayer(vectorLayer); // Добавляем слой с треками на карту
      },
      centerMapOnTrack(tracks, map) {
        if (!tracks || tracks.length === 0) {
            console.warn('Нет треков для вычисления средней точки.');
            return;
        }

        // Собираем все точки маршрута
        let allPoints = [];
        tracks.forEach(track => {
            allPoints = allPoints.concat(track.points);
        });

        if (allPoints.length === 0) {
            console.warn('Нет точек в треках для вычисления средней точки.');
            return;
        }

        // Вычисляем средние значения широты и долготы
        const avgLat = allPoints.reduce((sum, point) => sum + point.lat, 0) / allPoints.length;
        const avgLon = allPoints.reduce((sum, point) => sum + point.lon, 0) / allPoints.length;

        // Преобразуем среднюю точку в проекцию EPSG:3857
        const center = fromLonLat([avgLon, avgLat]);

        // Обновляем центр карты
        map.getView().setCenter(center);
      }
    },
  };
  </script>
  
  <style>
  .map {
      width: 100%;
      height: 400px;
  }
  </style>
  
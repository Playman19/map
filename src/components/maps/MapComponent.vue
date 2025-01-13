<template>
    <div ref="map" class="map"></div>
    <h1> Фото {{ activeMarker }}</h1>
    <br><br><br><br><br>
    <h2>Темы {{ activeMarker }}</h2>
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
  
  export default {
    name: 'MapComponent',
    data() {
      return {
        activeMarker: null, // Переменная для хранения активного маркера
        markers: [], // Хранение всех маркеров для доступа к ним
        markerStyles: {
          default: {
            outer: {
              radius: 10,
              fill: '#003153',
              stroke: { color: 'white', width: 2 }
            },
            inner: {
              radius: 3,
              fill: 'white'
            }
          },
          active: {
            outer: {
              radius: 10,
              fill: 'red',
              stroke: { color: 'white', width: 2 }
            },
            inner: {
              radius: 3,
              fill: 'white'
            }
          }
        }
      };
    },
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
            center: fromLonLat([55.5490500, 24.8707700]), // Преобразуем координаты
            zoom: 8.5,
          }),
        });
  
        // Добавление маркеров
        this.addMarkers(map);
  
        // Обработчик клика по карте
        map.on('singleclick', (event) => {
            if (this.activeMarker) {
                this.activeMarker = null; // Сброс активного маркера
                }

                map.forEachFeatureAtPixel(event.pixel, (feature) => {
                if (feature) {
                    this.handleMarkerClick(feature);
                }})
        });
      },
  
      addMarkers(map) {
        const markers = [
          { name: "Бурдж-Халифа", coords: [55.2708, 25.1972] }, // Дубай
          { name: "Пальма Джумейра", coords: [55.1395, 25.1123] }, // Дубай
          { name: "Мечеть шейха Зайда", coords: [54.3922, 24.4125] }, // Абу-Даби
          { name: "Джебель-Хафит", coords: [55.7602, 24.2006] }, // Аль-Айн
          { name: "Горы Хаджар", coords: [56.0978, 25.1119] }, // Восточные ОАЭ
          { name: "Национальный парк Фуджейра", coords: [56.3544, 25.1280] }, // Фуджейра
        ];
  
        const vectorSource = new VectorSource(); // Создаем источник для векторных данных
  
        markers.forEach(marker => {
          const feature = new Feature({
            geometry: new Point(fromLonLat(marker.coords)),
          });
  
          feature.set('name', marker.name); // Устанавливаем имя маркера
  
          feature.setStyle(this.getMarkerStyle(marker)); // Устанавливаем стиль маркера
  
          vectorSource.addFeature(feature); // Добавляем маркер в источник
          
          this.markers.push(feature); // Сохраняем маркер в массив для дальнейшего использования
        });
  
        const vectorLayer = new VectorLayer({
          source: vectorSource,
        });
  
        map.addLayer(vectorLayer); // Добавляем слой с маркерами на карту
      },
  
      getMarkerStyle(marker) {
        return this.activeMarker === marker.name ? 
          this.createStyle(this.markerStyles.active) : 
          this.createStyle(this.markerStyles.default);
      },
  
      createStyle(styleConfig) {
        return [
          new Style({
            image: new Circle({
              radius: styleConfig.outer.radius,
              fill: new Fill({ color: styleConfig.outer.fill }),
              stroke: new Stroke(styleConfig.outer.stroke)
            }),
          }),
          new Style({
            image: new Circle({
              radius: styleConfig.inner.radius,
              fill: new Fill({ color: styleConfig.inner.fill }),
            }),
          })
        ];
      },
  
      handleMarkerClick(feature) {
        const markerName = feature.get('name'); 

        // Сбрасываем стиль у всех маркеров
        this.markers.forEach(marker => {
            marker.setStyle(this.getMarkerStyle({ name: marker.get('name') })); // Устанавливаем стиль по умолчанию
        });

        // Устанавливаем новый активный маркер
        this.activeMarker = markerName;

        // Обновляем стиль текущего маркера
        feature.setStyle(this.getMarkerStyle({ name: markerName }));

        console.log(this.activeMarker); // Логируем активный маркер
      }
    },
  };
  </script>
  
<style>
.map {
    width: 960px;
    height: 480px;
    margin-top: 24px;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
}
h1, h2 {
    color: rgb(246 77 40);
    font-weight: 500;
    font-family: Arial, Helvetica, sans-serif;
}
</style>
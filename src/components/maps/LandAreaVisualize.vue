<template>
    <div ref="map" id="map" style="width: 100%; height: 600px;"></div>
  </template>
  
  <script>
  import { Map, View } from 'ol';
  import { Point, Polygon } from 'ol/geom';
  import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
  import { OSM, Vector as VectorSource } from 'ol/source';
  import { Feature } from 'ol';
  import { useGeographic } from 'ol/proj';
  
  export default {
    mounted() {
      useGeographic(); // Вызов функции для работы с географическими координатами
  
      // Координаты вершин участка
      const coordinates = [
        [34.204439,53.212789],
        [34.204761, 53.212049],
        [34.206606,53.212274],
        [34.206349,53.21304],
        [34.204439,53.212789]
      ];
  
      // Создание полигона
      const polygon = new Polygon([coordinates]);
  
      // Рассчет центра полигона
      const polygonCoords = polygon.getCoordinates()[0];
      const sumX = polygonCoords.reduce((sum, coord) => sum + coord[0], 0);
      const sumY = polygonCoords.reduce((sum, coord) => sum + coord[1], 0);
      const centerX = sumX / polygonCoords.length;
      const centerY = sumY / polygonCoords.length;
  
      // Создание карты
      this.map = new Map({
        target: this.$refs.map,
        layers: [
          new TileLayer({ source: new OSM() }),
          new VectorLayer({
            source: new VectorSource({
              features: [new Feature({ geometry: polygon })],
            }),
          }),
        ],
        view: new View({
          center: [centerX, centerY],
          zoom: 17,
        }),
      });
    }
  }
  </script>
  
  <style>
  #map {
    border: 1px solid black;
  }
  </style>
  
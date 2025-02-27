<template>
  <main>
    <!-- <MapComponent /> -->
    <!-- <PanoramaViewer /> -->
    <!-- <CheckUserGeoOnMap /> -->
    <!-- <GPXVisualize /> -->
    <LandAreaVisualize />
  </main>
</template>

<script setup>
import CheckUserGeoOnMap from './components/maps/CheckUserGeoOnMap.vue';
import GPXVisualize from './components/maps/GPXVisualize.vue';
import MapComponent from './components/maps/MapComponent.vue';
import PanoramaViewer from './components/panorams/PanoramaViewer.vue';
import LandAreaVisualize from './components/maps/LandAreaVisualize.vue';


</script>
<style>
html, body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(54 61 67);
  min-height: 100vh;
}
</style>

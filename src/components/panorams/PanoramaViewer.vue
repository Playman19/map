<template>
    <div ref="panoramaContainer" class="panorama-container"></div>
  </template>
  
  <script>
  import * as THREE from 'three';
  
  export default {
    name: 'PanoramaViewer',
    data() {
        return {
            imageUrl: '/p2.jpg'
        }
    },
    mounted() {
      this.initPanorama();
    },
    methods: {
      initPanorama() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.$refs.panoramaContainer.appendChild(renderer.domElement);
  
        // Создание сферы для панорамы
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        const texture = new THREE.TextureLoader().load(this.imageUrl);
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.scale.x = -1; // Инвертируем текстуру
        scene.add(sphere);
  
        camera.position.set(0, 0, 0);
  
        // Обработчик событий для вращения камеры
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const onMouseDown = (event) => {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        const onMouseMove = (event) => {
        if (isDragging) {
            const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y,
            };

            // Изменяем направление вращения
            sphere.rotation.y -= deltaMove.x * 0.005; // Вращение по оси Y
            sphere.rotation.x -= deltaMove.y * 0.005; // Вращение по оси X

            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
        };

        const onMouseUp = () => {
        isDragging = false;
        };

        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        // Анимация
        const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        };

        animate();
      },
    },
  };
  </script>
  
  <style scoped>
  .panorama-container {
    width: 100%;
    height: 100vh; /* Занять всю высоту окна */
  }
  </style>
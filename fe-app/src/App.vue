<template>
    <div id="app" class="container-fluid h-100">
        <div class="row h-100">
            <div class="col-2"></div>
            <div class="col-10">
                <leaflet-map/>
            </div>
        </div>
    </div>
</template>

<script>
    import LeafletMap from './components/LeafletMap.vue'

    export default {
        name: 'app',
        components: {
            LeafletMap
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    html, body {
        height: 100%;
    }
</style>

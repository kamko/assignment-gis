<template>
    <div id="app" class="container-fluid h-100">
        <div class="row h-100">
            <div class="col-2">
                <Menu/>
            </div>
            <div class="col-10">
                <LeafletMap
                :center="[48.139309, 17.098169]"/>
            </div>
        </div>
    </div>
</template>

<script>
    import {Menu, LeafletMap} from './components'

    export default {
        name: 'app',
        components: {
            LeafletMap,
            Menu
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

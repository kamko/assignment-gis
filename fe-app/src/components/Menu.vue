<template>
    <div>
        <!--<div class="row" v-if="Object.keys(marker.lat).length && Object.keys(marker.lng).length">-->
            <!--Selected town: {{ town.properties.name }} <br>-->
            <!--Lat: {{ marker.lat.toFixed(5) }} <br>-->
            <!--Lng: {{ marker.lng.toFixed(5) }} <br>-->
        <!--</div>-->
        <div class="row mt-3 justify-content-center">
            <p>Scenario: {{ scenario }}</p> <br>
        </div>
        <div class="row justify-content-center">
            <div class="custom-control custom-radio">
                <input type="button" value="town" @click="selectScenario">
            </div>
            <div class="custom-control custom-radio">
                <input type="button" value="nearby" @click="selectScenario">
            </div>
        </div>

        <div class="row" v-if="scenario === 'nearby'">
            <label for="range">Selected range: {{ this.rangeValue }}</label>
            <input type="range" class="custom-range" min="50" max="5000" id="range" :value=rangeValue
                   @mouseup="showNearby">
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'Menu',
        comments: {},
        methods: {
            selectScenario(event) {
                this.$store.dispatch('selectScenario', event.target.value)
            },
            showNearby(event) {
                this.$store.dispatch('fetchNearbyPlaces', {...this.marker, range: parseInt(event.target.value)});
            }
        },
        computed: {...mapGetters(['marker', 'town', 'scenario', 'rangeValue'])}
    }
</script>

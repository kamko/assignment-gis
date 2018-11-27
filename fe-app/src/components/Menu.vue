<template>
    <div>
        <div class="row" v-if="marker.lat && marker.lng">
                <div class="col-6">Lat: {{ marker.lat.toFixed(5) }}</div>
                <div class="col-6">Lng: {{ marker.lng.toFixed(5) }}</div>
        </div>
        <div class="row mt-3 justify-content-center">
            <p>Scenario: {{ scenario }}</p> <br>
        </div>
        <div class="row">
            <div class="col-12 btn-group d-flex mb-3" role="group">
                <button type="button" class="btn w-100" value="town" @click="selectScenario"
                        v-bind:class="buttonClasses('town')" :disabled="scenario === 'town'">Town
                </button>
                <button type="button" class="btn w-100" value="nearby" @click="selectScenario"
                        v-bind:class="buttonClasses('nearby')" :disabled="scenario === 'nearby'">Nearby
                </button>
                <button type="button" class="btn w-100" value="treti" @click="selectScenario"
                        v-bind:class="buttonClasses('treti')" :disabled="scenario === 'treti'">Tretiii
                </button>
            </div>
        </div>

        <div class="row" v-if="scenario === 'town' && Object.keys(town).length">
            <div class="col-12">
                <h5>{{ town.properties.name }}</h5>
            </div>
        </div>

        <div class="row" v-if="scenario === 'nearby'">
            <div class="col-12">
                <label class="w-100" for="range">Selected range: {{ this.rangeValue }}</label>
            </div>
            <div class="col-12">
                <input type="range" class="custom-range w-100" min="50" max="5000" id="range" :value=rangeValue
                       @mouseup="showNearby">
            </div>
        </div>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'Menu',
        comments: {},
        methods: {
            buttonClasses(scenario) {
                return {
                    'btn-success': this.scenario === scenario,
                    'btn-outline-danger': this.scenario !== scenario
                }
            },
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

<style scoped>
</style>

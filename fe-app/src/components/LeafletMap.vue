<template>
    <l-map
            :zoom="zoom"
            :center="center"
            @click="putMarker">
        <l-tile-layer
                :url="url"
                :attribution="attribution"/>
        <l-marker v-if="marker.lat && marker.lng"
                  :lat-lng="[marker.lat, marker.lng]"
                  @click="removeMarker"/>
        <l-geo-json
                v-if="Object.keys(churchData).length"
                :geojson="churchData"
                :options="churchOptions"/>
        <l-geo-json
                v-if="Object.keys(town).length"
                :geojson="town"
                :optionsStyle="townStyle"/>
    </l-map>
</template>

<script>
    import Vue from 'vue';
    import {LGeoJson, LMap, LMarker, LTileLayer} from 'vue2-leaflet';
    import ChurchPopup from './ChurchPopup'
    import {mapGetters} from 'vuex';

    export default {
        name: 'LeafletMap',
        components: {
            LMap,
            LTileLayer,
            LGeoJson,
            LMarker
        },
        data() {
            return {
                churchOptions: {
                    onEachFeature: (feature, layer) => {
                        let Popup = Vue.extend(ChurchPopup);
                        let popup = new Popup({
                            propsData: {
                                type: feature.properties.religion,
                                denomination: feature.properties.denomination,
                                name: feature.properties.name,
                                area: -1
                            }
                        });
                        layer.bindPopup(popup.$mount().$el);
                    }
                }
            }
        },
        props: {
            zoom: {
                type: Number,
                default: 15
            },
            center: {
                type: Array,
                default: () => [1, 1]
            },
            url: {
                type: String,
                default: 'https://api.mapbox.com/styles/v1/kamko/cjox8h8161xh92snhft6q1at3/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2Fta28iLCJhIjoiY2pvd3RjcXNnMHN1NTNsbnl0eHg5dmlpZCJ9.nks03xACHawGHjfqtvkSTA'
            },
            attribution: {
                type: String,
                default: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
            }
        },
        methods: {
            putMarker(event) {
                this.$store.commit('setMarker', {...event.latlng});
                this.$store.dispatch('fetchTown', {...event.latlng});
            },
            removeMarker() {
                this.$store.commit('setMarker', {})
            },
            townStyle(feature) {
                return {
                    color: "#ff003a",
                    fillOpacity: 0
                }
            }
        },
        computed: {
            ...mapGetters(['marker', 'churchData', 'town'])
        }
    }
</script>

<style scoped>
    @import '~leaflet/dist/leaflet.css';
</style>
<template>
    <l-map
            :zoom="zoom"
            :center="center"
            @click="putMarker">
        <l-tile-layer
                :url="url"
                :attribution="attribution"/>

        <l-marker v-if="marker.lat && marker.lng"
                  :lat-lng="[marker.lat, marker.lng]"/>
        <l-geo-json
                v-if="worshipPlaces.features"
                :geojson="worshipPlaces"
                :options="worshipOptions"/>
        <l-geo-json
                v-if="Object.keys(town).length"
                :geojson="town"
                :optionsStyle="townStyle"/>
        <l-geo-json
                v-if="Object.keys(roads).length"
                :geojson="roads"
        />
        <l-circle
                v-if="scenario === 'nearby' && marker.lat && marker.lng"
                :lat-lng="[marker.lat, marker.lng]"
                :radius="rangeValue"
                color="#ff003a" fillColor="#ff003a" fillOpacity="0.15"/>
    </l-map>
</template>

<script>
    import Vue from 'vue';
    import {LGeoJson, LMap, LMarker, LTileLayer, LCircle} from 'vue2-leaflet';
    import ChurchPopup from './ChurchPopup'
    import {mapGetters} from 'vuex';

    export default {
        name: 'LeafletMap',
        components: {
            LMap,
            LTileLayer,
            LGeoJson,
            LMarker,
            LCircle
        },
        data() {
            return {
                worshipOptions: {
                    pointToLayer: (feature, latlng) => {
                        return L.marker(latlng, {
                            icon: L.icon({
                                iconUrl: 'https://i.imgur.com/YK0PVMf.png',
                                iconSize: [35, 35],
                                iconAnchor: [15, 25],
                                popupAnchor: [0, -30]
                            })
                        });
                    },
                    filter: (feature) => {
                        const fReligion = feature.properties.religion;
                        switch (this.religions.selected) {
                            case 'All':
                                return true;
                            case 'unknown':
                                if (fReligion === null) {
                                    return true;
                                }
                                break;
                            default:
                                return fReligion === this.religions.selected;
                        }
                    },
                    onEachFeature: (feature, layer) => {
                        let Popup = Vue.extend(ChurchPopup);
                        let popup = new Popup({
                            propsData: {
                                type: feature.properties.religion,
                                denomination: feature.properties.denomination,
                                name: feature.properties.name,
                                building: feature.properties.building
                            }
                        });
                        layer.bindPopup(popup.$mount().$el);
                    }
                }
            }
        },
        created() {
            this.$store.dispatch('fetchReligions');
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
                console.log(this.scenario);
                this.$store.commit('setMarker', {...event.latlng});
                this.$store.dispatch('runCommand');
            },
            townStyle(feature) {
                return {
                    color: "#ff003a",
                    fillOpacity: 0
                }
            }
        },
        computed: {
            ...mapGetters(['marker', 'worshipPlaces', 'town', 'scenario', 'rangeValue', 'religions', 'roads'])
        }
    }
</script>

<style scoped>
    @import '~leaflet/dist/leaflet.css';
</style>
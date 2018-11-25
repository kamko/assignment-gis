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
    </l-map>
</template>

<script>
    import {
        LMap,
        LTileLayer,
        LGeoJson,
        LMarker
    } from 'vue2-leaflet';
    import {mapGetters} from 'vuex';

    export default {
        name: 'LeafletMap',
        components: {
            LMap,
            LTileLayer,
            LGeoJson,
            LMarker
        },
        props: {
            zoom: {
                type: Number,
                default: 5
            },
            center: {
                type: Array,
                default: () => [48.139309, 17.098169]
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
                this.$store.commit('setMarker', {...event.latlng})
            },
            removeMarker() {
                this.$store.commit('setMarker', {})
            }
        },
        computed: {
            ...mapGetters(['marker'])
        }
    }
</script>

<style scoped>
    @import '~leaflet/dist/leaflet.css';
</style>
<template>
    <div class="row">
        <input type="button" value="Churches" @click="fetchChurches">
        Lat: {{ marker.lat.toFixed(5) }} <br>
        Lng: {{ marker.lng.toFixed(5) }}
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'Menu',
        comments: {},
        methods: {
            fetchChurches() {
                this.$store.dispatch('fetchChurchData');
            }
        },
        computed: {...mapGetters(['marker'])}
    }
</script>

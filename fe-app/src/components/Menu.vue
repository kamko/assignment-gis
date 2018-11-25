<template>
    <div class="row">
        Lat: {{ marker.lat.toFixed(5) }} <br>
        Lng: {{ marker.lng.toFixed(5) }}
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'Menu',
        comments: {},
        computed: {...mapGetters(['marker'])}
    }
</script>

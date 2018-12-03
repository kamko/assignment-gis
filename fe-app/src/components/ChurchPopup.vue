<template>
    <div>
        <h4>{{ type }} {{ denomination}}</h4>
        <ul>
            <li>Name: {{ name }}</li>
            <li>Building: {{ building }}</li>
        </ul>
        <button class="btn btn-primary" @click="showWaterway">Show nearest waterway</button>
    </div>
</template>

<script>
    export default {
        name: 'ChurchPopup',
        props: {
            type: {
                type: String,
                default: 'unknown'
            },
            denomination: {
                type: String,
                default: 'unknown denomination'
            },
            name: {
                type: String,
                default: ''
            },
            area: {
                type: Number,
                default: 0
            },
            building: {
                type: String,
                default: ''
            },
            lat: {
                type: Number,
                default: 0
            },
            lng: {
                type: Number,
                default: 0
            }
        },
        methods: {
            showWaterway(event) {
                this.$store.dispatch('fetchWaterway', {lat: this.lat, lng: this.lng})
            }
        }
    };
</script>
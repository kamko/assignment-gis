<template>
    <div>
        <h4>{{ type }} ({{ denomination}})</h4>
        Name: {{ name }}
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
            }
        }
    };
</script>
<template>
    <div>
        <h4>{{ type }} ({{ denomination}})</h4>
        <ul>
            <li>Name: {{ name }}</li>
            <li>Area: {{ area }} m2</li>
        </ul>
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
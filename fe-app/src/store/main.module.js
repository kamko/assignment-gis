const state = {
    marker: {
        lat: undefined,
        lng: undefined
    },
    hlohovec: undefined
};

const getters = {
    marker(state) {
        return {...state.marker}
    }
};

const actions = {};

const mutations = {
    setMarker(state, {lat, lng}) {
        console.log(`setMarker([${lat}, ${lng}])`);
        state.marker.lat = lat;
        state.marker.lng = lng;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
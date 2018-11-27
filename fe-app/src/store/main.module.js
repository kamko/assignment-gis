import axios from 'axios'

const state = {
    marker: {
        lat: undefined,
        lng: undefined
    },
    churchData: undefined,
    town: undefined
};

const getters = {
    marker(state) {
        return {...state.marker}
    },
    churchData(state) {
        return {...state.churchData}
    },
    town(state) {
        return {...state.town}
    }
};

const actions = {
    fetchChurchData({commit}) {
        axios.get('http://localhost:8081/')
            .then((res) => {
                commit('setChurchData', res.data)
            });
    },
    fetchTown({commit}, {lat, lng}) {
        axios.get('http://localhost:8081/town', {
                params: {
                    lat, lng
                }
            }
        ).then((res) => {
            console.log(res);
            commit('setTown', res.data)
        });
    }
};

const mutations = {
        setMarker(state, {lat, lng}) {
            console.log(`setMarker([${lat}, ${lng}])`);
            state.marker.lat = lat;
            state.marker.lng = lng;
        },
        setChurchData(state, data) {
            state.churchData = data;
        },
        setTown(state, data) {
            state.town = data;
        }
    }
;

export default {
    state,
    getters,
    actions,
    mutations
}
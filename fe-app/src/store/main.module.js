import axios from 'axios'

const state = {
    marker: {
        lat: undefined,
        lng: undefined
    },
    worshipPlaces: undefined,
    town: undefined
};

const getters = {
    marker(state) {
        return {...state.marker}
    },
    worshipPlaces(state) {
        return {...state.worshipPlaces}
    },
    town(state) {
        return {...state.town}
    }
};

const actions = {
    fetchWorshipData({commit}, {uid}) {
        console.log(`fetchChurchData (uid=${uid})`);
        axios.get('http://localhost:8081/worshipPlaces', {
                params: {uid}
            }
        ).then((res) => {
                commit('setWorshipData', res.data)
            });
    },
    fetchTown({commit, dispatch}, {lat, lng}) {
        console.log(`fetchTown (lat=${lat}, lng=${lng})`);
        axios.get('http://localhost:8081/town', {
                params: {
                    lat, lng
                }
            }
        ).then((res) => {
            commit('setTown', res.data);
            dispatch('fetchWorshipData', {uid: res.data.id})
        });
    }
};

const mutations = {
        setMarker(state, {lat, lng}) {
            console.log(`setMarker([${lat}, ${lng}])`);
            state.marker.lat = lat;
            state.marker.lng = lng;
        },
        setWorshipData(state, data) {
            state.worshipPlaces = data;
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
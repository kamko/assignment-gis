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
    fetchChurchData({commit}, {uid}) {
        console.log(`fetchChurchData (uid=${uid})`);
        axios.get('http://localhost:8081/churches', {
                params: {uid}
            }
        ).then((res) => {
                commit('setChurchData', res.data)
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
            console.log(res);
            commit('setTown', res.data);
            dispatch('fetchChurchData', {uid: res.data.id})
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
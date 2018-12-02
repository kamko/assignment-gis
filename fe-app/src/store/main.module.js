import axios from 'axios'

const SERVER_URI = 'http://localhost:8081';

const state = {
    scenario: "town",
    marker: {
        lat: undefined,
        lng: undefined
    },
    worshipPlaces: {},
    town: {},
    roads: {},
    rangeValue: 50,
    religions: {
        selected: undefined,
        data: undefined
    }
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
    },
    scenario(state) {
        return state.scenario
    },
    rangeValue(state) {
        return parseInt(state.rangeValue)
    },
    religions(state) {
        return state.religions;
    },
    roads(state) {
        return state.roads;
    }
};

const actions = {
    fetchReligions({commit}) {
        console.log(`fetchReligions`);
        axios.get(`${SERVER_URI}/religions`)
            .then((res) => {
                let data = res.data;
                data.unshift('All');
                commit('setReligions', data)
            });
    },
    fetchWorshipData({commit}, {uid}) {
        console.log(`fetchWorshipData (uid=${uid})`);
        axios.get(`${SERVER_URI}/worshipPlaces`, {
                params: {uid}
            }
        ).then((res) => {
            console.log('town:', res.data);
            commit('setWorshipData', res.data)
        });
    },
    fetchTown({commit, dispatch}, {lat, lng}) {
        console.log(`fetchTown (lat=${lat}, lng=${lng})`);
        axios.get(`${SERVER_URI}/town`, {
                params: {
                    lat, lng
                }
            }
        ).then((res) => {
            commit('setTown', res.data);

            if (Object.keys(res.data).length) {
                dispatch('fetchWorshipData', {uid: res.data.id})
            }
        });
    },
    fetchNearbyPlaces({commit}, {lat, lng, range}) {
        console.log(`fetchNearbyPlaces (lat=${lat}, lng=${lng}, range=${range})`);
        commit('setRange', range);
        axios.get(`${SERVER_URI}/nearby`, {
                params: {
                    lat, lng, range
                }
            }
        ).then((res) => {
            console.log('nearby:', res.data);
            commit('setWorshipData', res.data)
        });
    },
    runCommand({state, commit, dispatch}) {
        console.log('runCommand', state.scenario);
        commit('clearMap');

        switch (state.scenario) {
            case 'town':
                dispatch('fetchTown', {...state.marker});
                break;
            case 'nearby':
                dispatch('fetchNearbyPlaces', {...state.marker, range: state.rangeValue});
                break;
            case 'roads':
                break
        }
    },
    selectScenario({scenario, commit, dispatch}, value) {
        commit('clearMap');
        commit('selectScenario', value);
        if (value !== 'town') {
            commit('setTown', {});
        }
        dispatch('runCommand', scenario)
    },
    setSelectedReligion({commit, state, dispatch}, value) {
        commit('setSelectedReligion', value);
        commit('setWorshipData', {...state.worshipPlaces});
    },
    fetchRoads({commit, state}) {
        axios.get(`${SERVER_URI}/roads`, {
                params: {
                    ...state.marker
                }
            }
        ).then(res => {
                console.log('roads:', res.data);
                commit('setRoads', res.data)
            }
        )
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
    },
    clearMap(state) {
        state.worshipPlaces = {};
    },
    selectScenario(state, value) {
        state.scenario = value;
    },
    setRange(state, value) {
        state.rangeValue = value;
    },
    setReligions(state, value) {
        state.religions.data = value;
        state.religions.selected = value[0];
    },
    setSelectedReligion(state, value) {
        state.religions.selected = value;
    },
    setRoads(state, value) {
        state.roads = value;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
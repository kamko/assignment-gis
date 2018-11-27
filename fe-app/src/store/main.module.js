import axios from 'axios'

const state = {
    scenario: "town",
    marker: {
        lat: undefined,
        lng: undefined
    },
    worshipPlaces: {},
    town: {},
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
    }
};

const actions = {
    fetchReligions({commit}) {
        console.log(`fetchReligions`);
        axios.get('http://localhost:8081/religions')
            .then((res) => {
                let data = res.data;
                data.unshift('All');
                commit('setReligions', data)
            });
    },
    fetchWorshipData({commit}, {uid}) {
        console.log(`fetchWorshipData (uid=${uid})`);
        axios.get('http://localhost:8081/worshipPlaces', {
                params: {uid}
            }
        ).then((res) => {
            console.log('town:', res.data);
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

            if (Object.keys(res.data).length) {
                dispatch('fetchWorshipData', {uid: res.data.id})
            }
        });
    },

    fetchNearbyPlaces({commit}, {lat, lng, range}) {
        console.log(`fetchNearbyPlaces (lat=${lat}, lng=${lng}, range=${range})`);
        commit('setRange', range);
        axios.get('http://localhost:8081/nearby', {
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
    setSelectedReligion({commit, dispatch}, value) {
        commit('setSelectedReligion', value);
        dispatch('runCommand');
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
    setSelectedReligion(staet, value) {
        state.religions.selected = value;
    }
    }
;

export default {
    state,
    getters,
    actions,
    mutations
}
const state = {
  calendar: null,
  members: [],
}

const actions = {
  addMember({ state, commit }, member) {
    commit('ADD_MEMBER', member)
  },
  deleteMember({ state, commit }, member) {
    commit('DELETE_MEMBER', member)
  },
  setCalendar({ state, commit }, calendar) {
    commit('SET_CALENDAR', calendar)
  },
  addCalendarItem({ state, commit }, item) {
    commit('ADD_CALENDAR_ITEM', item)
  },
  deleteCalendarItem({ state, commit }, item) {
    commit('DELETE_CALENDAR_ITEM', item)
  },
}

const mutations = {
  ADD_MEMBER(state, member) {
    state.members = state.members.push(member)
  },
  DELETE_MEMBER(state, member) {
    state.members = state.members.filter(item => {
      item.member !== member.id
    })
  },
  SET_CALENDAR(state, calendar) {
    state.calendar = calendar
  },
  ADD_CALENDAR_ITEM(state, item) {
    {
      {
        debugger
      }
    }
    if (state.calendar) {
      console.log('STATE CALENDAR', state.calendar)
      state.calendar.push(item)
    } else {
      state.calendar = new Array(item)
    }
  },
  DELETE_CALENDAR_ITEM(state, calendarItem) {
    state.calendar = state.calendar.filter(item => {
      calendarItem.member !== item.member && calendarItem.date !== item.date
    })
  },
}

const getters = {
  members(state) {
    return state.members || []
  },
  calendar(state) {
    return state.calendar || []
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}

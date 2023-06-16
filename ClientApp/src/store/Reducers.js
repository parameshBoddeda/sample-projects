import { ADD_SCHEDULE, DELETE_SCHEDULE, UPDATE_SCHEDULE } from "./ActionConstants"

//scheduleReducer - Sample reducer for reference
export const scheduleReducer = (state = {}, action) => {

    if (action.type === ADD_SCHEDULE) {
        return {
            ...state,
            schedules: state.schedules.concat(action.schedule)
        }
    }

    if (action.type === UPDATE_SCHEDULE) {
        return {
            ...state,
            schedules: state.schedules.concat(action.schedule)
        }
    }

    if (action.type === DELETE_SCHEDULE) {
        return {
            ...state,
            schedules: state.schedules.concat(action.schedule)
        }
    }
}
import { ADD_SCHEDULE, DELETE_SCHEDULE, UPDATE_SCHEDULE } from "./ActionConstants";

//Sample action creators for reference
export const addSchedule = (schedule) => ({
    type: ADD_SCHEDULE,
    schedule
})

export const updateSchedule = (schedule) => ({
    type: UPDATE_SCHEDULE,
    schedule
})

export const deleteSchedule = (schedule) => ({
    type: DELETE_SCHEDULE,
    schedule
})
import {
    GET_ALL_STAFFS,
    GET_STAFF_DETAILS,
  } from '../constants/actionTypes';
  
const initialState = {
    staffs: null,
    staffDetails: null,
}

export default function staffs(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_STAFFS:
        return {...state,
                staffs: action.staffs}
        case GET_STAFF_DETAILS:
        return {...state,
            staffDetails: action.staffDetails}
        default:
        return state;
    }
}
  
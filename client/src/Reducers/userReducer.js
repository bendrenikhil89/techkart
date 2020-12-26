export function userReducer(state = null, action){
    switch(action.type){
        case 'LOGGED_IN':
            return action.payload;
        case 'LOG_OUT':
            return action.payload;
        case 'PERSIST_LOGIN':
            return action.payload;
        default:
            return state;
    }
}
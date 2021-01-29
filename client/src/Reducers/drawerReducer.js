export function drawerReducer(state = false, action){
    switch(action.type){
        case 'SHOW_HIDE_DRAWER':
            return action.payload;
        default:
            return state;
    }
}
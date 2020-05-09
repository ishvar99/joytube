export default function(state={},action){
    switch(action.type){
        case 'login_user':
            return {...state,payload:action.payload}
        default:
            return state;
    }
}
import { ADD_CONTACT, REMOVE_CONTACT, TOGGLE_FAVORITE } from '../actions';

function contact(state, action) {
    switch (action.type) {
        case ADD_CONTACT: {
            return {
                id: action.id,
                name: action.name,
                email: action.email,
                favorite: false
            };
        }

        case TOGGLE_FAVORITE: {
            if (state.id !== action.id) {
                return state;
            }

            return {
                ...state,
                favorite: !state.favorite
            };
        }

        default: {
            return state;
        }
    }
}

export default function contacts(state = [], action) {
    switch (action.type) {
        case ADD_CONTACT: {
            return [
                ...state,
                contact(undefined, action)
            ];
        }

        case TOGGLE_FAVORITE: {
            return state.map(item => contact(item, action));
        }

        case REMOVE_CONTACT: {
            return state.filter(item => item.id !== action.id);
        }

        default: {
            return state;
        }
    }
}

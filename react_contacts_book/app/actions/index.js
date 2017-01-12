export const ADD_CONTACT = 'ADD_CONTACT';
export const REMOVE_CONTACT = 'REMOVE_CONTACT';
export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';
export const SET_FILTER = 'SET_FILTER';

export const addContact = newContact => {
    const { name, email } = newContact;
    return {
        type: 'ADD_CONTACT',
        id: Date.now(),
        name,
        email
    };
};

export const removeContact = id => {
    return {
        type: 'REMOVE_CONTACT',
        id
    };
};

export const toggleFavorite = id => {
    return {
        type: 'TOGGLE_FAVORITE',
        id
    };
};

export const setFilter = filter => {
    return {
        type: 'SET_FILTER',
        filter
    };
};

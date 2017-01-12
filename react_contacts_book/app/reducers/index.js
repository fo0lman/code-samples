import { combineReducers } from 'redux';

import contacts from './contacts';
import filter from './filter';

export default combineReducers({ contacts, filter });

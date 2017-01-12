import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { toggleFavorite, removeContact} from '../../actions';

import './style.scss';

import Contact from '../contact';

const getVisibleContacts = (contacts, filter) => {
    switch (filter) {
        case 'SHOW_ALL': {
            return contacts;
        }

        case 'SHOW_FAVORITED': {
            return contacts.filter(item => item.favorite);
        }

        default: {
            return contacts;
        }
    }
};

const mapStateToProps = state => ({
    contacts: getVisibleContacts(state.contacts, state.filter)
});

@connect(mapStateToProps, { toggleFavorite, removeContact })
export default class ContactsList extends Component {

    static propTypes = {
        contacts: PropTypes.array.isRequired,
        toggleFavorite: PropTypes.func.isRequired,
        removeContact: PropTypes.func.isRequired
    };

    state = {
        list: true
    };

    handleToggleFavorite = (id) => () => {
        this.props.toggleFavorite(id);
    };

    handleRemoveContact = (id) => () => {
        this.props.removeContact(id);
    };

    handleListView= () => {
        this.setState({list: true});
    };

    handleTileView= () => {
        this.setState({list: false});
    };

    render() {
        const { contacts } = this.props;
        const { list } = this.state;

        return (
            <div className="contacts-container">
                <ul className="view-selector">
                    <li><i className={`fa fa-list ${list ? 'active' : null }`} onClick={this.handleListView} /></li>
                    <li><i className={`fa fa-th-large ${!list ? 'active' : null }`} onClick={this.handleTileView} /></li>
                </ul>
                <div className={`contacts ${!list ? 'tile' : null }`}>
                    {
                        contacts.map(contact => {
                            return (
                                <Contact
                                    key={contact.id}
                                    id={contact.id}
                                    name={contact.name}
                                    email={contact.email}
                                    favorite={contact.favorite}
                                    onToggle={this.handleToggleFavorite(contact.id)}
                                    onRemove={this.handleRemoveContact(contact.id)}
                                />
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

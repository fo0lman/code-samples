import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { addContact } from '../../actions';

import './style.scss';

@connect(undefined, { addContact })
export default class AddContact extends Component {
    static propTypes = {
        addContact: PropTypes.func.isRequired
    };

    state = {
        name: '',
        email: ''
    };

    handleNameChange = event => {
        this.setState({
            name: event.target.value
        });
    };

    handleEmailChange = event => {
        this.setState({
            email: event.target.value
        });
    };

    handleFormSubmit = event => {
        event.preventDefault();
        const {name, email} = this.state;
        const newContact = {
            name,
            email
        };

        this.props.addContact(newContact);

        this.setState({
            name: '',
            email: ''
        });
    };

    render() {
        return (
            <div className="add">
                <form onSubmit={this.handleFormSubmit}>
                    <input
                        className="name"
                        type="text"
                        placeholder="Name"
                        value={this.state.name}
                        onChange={this.handleNameChange}
                        required="true"
                    />

                    <input
                        className="email"
                        type="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleEmailChange}
                        required="true"
                    />

                    <button type="submit" className="add-btn">Add Contact</button>
                </form>

            </div>
        );
    }
}

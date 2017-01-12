import React, { Component, PropTypes } from 'react';

import './style.scss';

export default class Contact extends Component {
    static propTypes = {
        id: PropTypes.number,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        favorite: PropTypes.bool.isRequired,
        onToggle: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
    };

    render() {
        const {
            name,
            email,
            favorite,
            onToggle,
            onRemove
        } = this.props;

        return (
            <div className="contact">
                <div className="favorite">
                    <i className={`fa ${ favorite ? 'fa-star' : 'fa-star-o' }`} onClick={onToggle}/>
                </div>
                <div className="name">{name}</div>
                <div className="email">{email}</div>
                <div className="send">
                    <a href={`mailto:${email}`}>Send e-mail</a>
                </div>
                <div className="remove">
                    <i className="fa fa-trash" onClick={onRemove}/>
                </div>
            </div>
        );
    }
}

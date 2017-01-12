import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { setFilter } from '../../actions';

const mapStateToProps = (state, ownProps) => ({
    active: ownProps.filter === state.filter
});

const mapDisplatchToProps = (dispatch, ownProps) => ({
    onClick: () => dispatch(setFilter(ownProps.filter))
});

@connect(mapStateToProps, mapDisplatchToProps)
export default class Link extends Component {
    static propTypes = {
        active: PropTypes.bool,
        children: PropTypes.string,
        onClick: PropTypes.func.isRequired
    };

    render() {
        const { active, children, onClick } = this.props;

        if (active) {
            return <span className="filter-link active">{children}</span>;
        }

        return <span className="filter-link" onClick={onClick}>{children}</span>;
    }
}

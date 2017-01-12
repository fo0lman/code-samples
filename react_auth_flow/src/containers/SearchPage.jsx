import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

import { searchMovies } from '../actions';

import SearchBox from '../components/SearchBox.jsx';
import Loader from '../components/Loader.jsx';
import MovieGrid from '../components/MovieGrid.jsx';

const styles = {
    container: {
        height: '100%',
        maxWidth: 800,
        width: '100%',
        paddingLeft: 16,
        paddingRight: 16,
        margin: '0 auto'
    }
};

@connect(mapStateToProps, { searchMovies, push })
export default class SearchPage extends Component {
    componentDidMount() {
        const { search, searchMovies } = this.props;

        if (search) {
            searchMovies(search);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.search !== this.props.search) {
            this.props.searchMovies(nextProps.search);
        }
    }

    handleSearch = search => {
        const { location } = this.props;

        this.props.push({
            pathname: location.pathname,
            query: { ...location.query, search }
        });
    }

    render() {
        return (
            <div>
                <SearchBox search={this.props.search} onSearch={this.handleSearch} />
                <div style={styles.container}>
                    <Loader loading={this.props.loading}>
                        <MovieGrid movies={this.props.movies} />
                    </Loader>
                </div>
            </div>
        );
    };
}

function mapStateToProps(state, ownProps) {
    return {
        movies: state.movies.items,
        loading: state.movies.isFetching,
        search: state.routing.locationBeforeTransitions.query.search
    };
}

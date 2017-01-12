import React, { Component } from 'react';

import MovieCard from './MovieCard.jsx';

const styles = {
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    }
};

export default props => {
    const { movies } = props;

    return (
        <div style={styles.container}>
            {
                movies.length !== 0
                ? movies.map(movie => <MovieCard key={movie.id} {...movie} />)
                : <p>No movies to display</p>
            }
        </div>
    );
}

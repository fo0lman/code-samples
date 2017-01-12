import React from 'react';
import Paper from 'material-ui/Paper';

const styles = {
    container: {
        width: '100%',
        maxWidth: 800,
        margin: '0 auto',
        display: 'flex',
    },
    img: {
        height: 450,
    },
    info: {
        marginLeft: 36,
        padding: 16
    },
    title: {
        fontWeight: 500
    },
    subtitle: {
        fontWeight: 500
    }
};

const MovieInfo = props => {
    return (
        <Paper zDepth={3} style={styles.container}>
            {
                props.posterPath
                && <img style={styles.img} src={`https://image.tmdb.org/t/p/w500${props.posterPath}`} />
            }
            <div style={styles.info}>
                <h1 style={styles.title}>{props.title}</h1>

                <p>{props.overview}</p>
            </div>
        </Paper>
    );
}

export default MovieInfo;

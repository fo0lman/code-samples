import React from 'react';
import { Link } from 'react-router';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    container: {
        width: '100%',
        display: 'flex',
        marginBottom: 16
    },
    img: {
        height: 278,
        width: 185,
        minWidth: 200
    },
    info: {
        marginLeft: 16,
        padding: 16,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        width: '100%'
    },
    title: {
        fontWeight: 500,
        fontSize: 18
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',
        padding: 8
    },
    overview: {
        color: 'gray',
        fontSize: 14
    }
};

const MovieCard = props => {
    const posterUrl = props.posterPath
        ? `https://image.tmdb.org/t/p/w500${props.posterPath}`
        : '/img/no-poster.jpg';

    return (
        <Paper style={styles.container}>
            <img style={styles.img} src={posterUrl} />
            <div style={styles.info}>
                <div>
                    <h1 style={styles.title}>{props.title}</h1>
                    <p style={styles.overview}>{props.overview}</p>
                </div>

                <div>
                    <Divider />
                    <div style={styles.actions}>
                        <Link to={`/movies/${props.id}`}>
                            <FlatButton
                                label="More info"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </Paper>
    );
}

export default MovieCard;

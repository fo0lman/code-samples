import React from 'react';

const styles = {
    container: {
        paddingTop: 200,
        position: 'relative'
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 500,
        zIndex: 1
    },
    content: {
        zIndex: 2,
        position: 'relative'
    }
};

const BackdropContainer = props => {
    const backdropUrl = props.backdropPath
        ? `https://image.tmdb.org/t/p/w650_and_h365_bestv2${props.backdropPath}`
        : '/img/no-backdrop.jpeg';

    const backdrop = {
        background: `url("${backdropUrl}") center center / cover`
    };

    return (
        <div style={styles.container}>
            <div style={{ ...styles.backdrop, ...backdrop }} />
            <div style={styles.content}>{props.children}</div>
        </div>
    );
}

export default BackdropContainer;

import React from 'react';

import CircularProgress from 'material-ui/CircularProgress';

const styles = {
    container: {
        width: '100%'
    },
    spinner: {
        margin: '24px auto',
        display: 'block'
    }
};

const Loader = props => {
    return (
        <div style={styles.container}>
            {
                props.loading
                ? <CircularProgress style={styles.spinner} size={60} thickness={5} />
                : props.children
            }
        </div>
    );
}

export default Loader;

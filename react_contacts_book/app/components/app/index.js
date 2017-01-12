import React from 'react';

import './style.scss';

import Filter from '../../components/filter';
import ContactsList from '../../components/contacts';
import AddBlock from '../../components/add';

const App = () => (
    <div className="container">
        <div className="content">
            <h1 className="logo"><i className="fa fa-address-book" /></h1>
            <AddBlock />
            <Filter />
            <ContactsList />
        </div>
        <p className="copyright">Sergey Yarchuk &copy; 2016</p>
    </div>
);

export default App;


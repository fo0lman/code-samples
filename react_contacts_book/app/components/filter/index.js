import React from 'react';

import Link from './link';

import './style.scss';

const Filter = () => (
    <ul className="filter">
        <li>
            <Link filter="SHOW_ALL">All</Link>
        </li>
        <li>
            <Link filter="SHOW_FAVORITED">Favorited</Link>
        </li>
    </ul>
);

export default Filter;

/*
 * Get out of the array members
 * distribution of Interest
 * EX: {computers: 3 Power: 5 math: 1, Cat 3}
 * where is the key corresponds to the name Interest
 * a value - the number of people with such interest
 */

{
    const users = [{
        name: 'Vasya',
        surname: 'Ivanov',
        interests: ['computers', 'food']
    }, {
        name: 'Ivan',
        surname: 'Tretyakov',
        interests: ['computers', 'food', 'cars']
    }, {
        name: 'Daryna',
        surname: 'Petrova',
        interests: ['cars', 'math']
    }, {
        name: 'Petro',
        surname: 'Nalyvaiko',
        interests: ['computers', 'food', 'math']
    }];

    // 1st way
    const interestsCount = users.reduce((allInterests, user) => [...allInterests, ...user.interests], []).reduce((obj, interest) => { obj[interest] = obj[interest] + 1 || 1; return obj; }, {});

    // 2nd way
    const interestsCount_snd = {};
    users.forEach(user => user.interests.forEach(interest => interestsCount_snd[interest] = interestsCount_snd[interest] + 1 || 1 ));

}
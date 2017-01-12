/*
 * Average order amount
 */

{
    const orders = [{
        id: 5,
        date: '21-01-2015',
        amount: 783
    }, {
        id: 8,
        date: '24-01-2015',
        amount: 67
    }, {
        id: 21,
        date: '29-01-2015',
        amount: 1234
    }, {
        id: 78,
        date: '04-02-2015',
        amount: 123
    }, {
        id: 23,
        date: '15-02-2015',
        amount: 245
    }];

    const averageAmount = orders.reduce((totalAmount, order, index, orders) => totalAmount + (order.amount / orders.length), 0);
}
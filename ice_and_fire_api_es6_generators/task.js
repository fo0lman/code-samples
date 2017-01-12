/*
 * Write a function generator, which is the number of the book (book)
 * Receives the name of the house (house) with a maximum number of dead characters (character).
 * API Documentation: https://anapioficeandfire.com/
 *
*/

{
    function* fetchGenerator(url) {
        const request = yield fetch(url);

        return yield request.json();
    }

    function* dataGenerator(urls) {
        const array = [];

        for (let url of urls) {
            array.push(yield* fetchGenerator(url));
        }

        return array;
    }

    function run(generator, ...args) {
        const iterator = generator(...args);

        const iterate = ({done, value}) => {
            if (done) {
                return value;
            }

            return value.then(data => iterate(iterator.next(data)))
        };

        return iterate(iterator.next());
    }

    function* getHouseWithMaxDiedCharacters(bookId) {

        //get characters urls
        const { characters: bookCharactersURLs } = yield* fetchGenerator(`http://anapioficeandfire.com/api/books/${bookId}`);

        //get characters data
        const bookCharacters = yield* dataGenerator(bookCharactersURLs);

        //find died characters
        const diedCharacters = bookCharacters.filter(character => character.died.length > 0);

        //get died characters house urls
        const houseUrls = diedCharacters.reduce((array, character) => {
            character.allegiances.forEach(houseUrl => {
                array.push(houseUrl);
            });
            return array;
        }, []);

        //get died characters houses data
        const houses = yield* dataGenerator(houseUrls);

        //calculate houses died characters
        const countObj = Object.create({});
        houses.forEach(house => countObj[house.name] = countObj[house.name] + 1 || 1 );

        //get house name with max died characters
        const getHouseName = (object) => Object.keys(object).reduce((a, b) => object[a] > object[b] ? a : b);

        return getHouseName(countObj);
    }

    run(getHouseWithMaxDiedCharacters, 2).then(console.log).catch(console.error);
}

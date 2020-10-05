var Bicicleta = require('../../models/bicicleta');

beforeEach(() => {Bicicleta.allBicis = [];}); //this method is executed in each espec IN ORDER TO CLEAN THE Bicis

//the list of Bicicletas has to start empty 
describe('Bicicleta.allBicis', () => {
    it('comienza vacio', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

//the list of Bicicletas has to start empty 
describe('Bicicleta.add', () => {
    it('Agregamos un bicicleta', () => {
        expect(Bicicleta.allBicis.length).toBe(0);

        var a =new Bicicleta(1,'rojo','urbana', [21.844862, -102.254499])
        Bicicleta.add(a);//adding a bicicleta

        expect(Bicicleta.allBicis.length).toBe(1);//se agrega un elemento 
        expect(Bicicleta.allBicis[0]).toBe(a);//the first position has to be the bicicleta that we added
    });
});

//the list of Bicicletas has to start empty 
describe('Bicicleta.findById', () => {
    it('Debe devolver la bici con id ', () => {

        expect(Bicicleta.allBicis.length).toBe(0);

        var aBici =new Bicicleta(1,'rojo','urbana', [21.844862, -102.254499])
        var aBici2 =new Bicicleta(1,'azul','montaña', [21.844862, -102.254499])

        Bicicleta.add(aBici);//adding a bicicleta
        Bicicleta.add(aBici2);//adding a bicicleta

        var targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(aBici.color);
        expect(targetBici.modelo).toBe(aBici.modelo);

    });
});
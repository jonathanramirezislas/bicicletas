var mongoose = require('mongoose');
const Bicicleta = require('../../models/bicicleta');


describe('Testing Bicicletas', function(){
    beforeEach(function(done){

        setTimeout(function() {

            var mongoDB = 'mongodb://localhost/testdb'
            mongoose.connect(mongoDB, { useNewUrlParser: true})
        
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error'));
            db.once('open', function(){
              console.log('We are connected to test database!');
            });
            done();// es par terminar el beforeEach de otra manera no terminaria el metodo
          }, 100);
        
     
    });
  
    afterEach(function(done){
      Bicicleta.deleteMany({}, function(err, success){
        done(); 
        if (err) console.log(err);
      });
    });
  

    //Test 
    describe('Bicicleta.createInstance', () => {
      it('crea una instancia de Bicicleta', () => {
        var bici = Bicicleta.createInstance(1,"verde","urbana", [-34.5, -54.1]);
  
        expect(bici.code).toBe(1);
        expect(bici.color).toBe("verde");
        expect(bici.modelo).toBe("urbana");
        expect(bici.ubicacion[0]).toEqual(-34.5);
        expect(bici.ubicacion[1]).toEqual(-54.1);
      });
    });
    describe('Bicicleta.allBicis', () => {
      it('comienza vacia', (done)  => {
        Bicicleta.allBicis(function(err, bicis){
          expect(bicis.length).toBe(0);
          done();
        });
      });
    });
  
    describe('Bicicleta.add', () => {
      it('agrega solo una bici', (done) => {
        var aBici = new Bicicleta({code: 1, color:"verde", modelo:"urbana"});
        Bicicleta.add(aBici, function(err, newBici){
          if ( err ) console.log(err);
          Bicicleta.allBicis(function(err, bicis){
            expect(bicis.length).toEqual(1);
            expect(bicis[0].code).toEqual(aBici.code);
            done();
          });
        });
      });    
    });
  
    describe('Bicicleta.findByCode', () => {
        it('debe de devolver la bici con code 1', (done) => {
          Bicicleta.allBicis(function(err, bicis){
            expect(bicis.length).toBe(0);
    
            var aBici = new Bicicleta({code: 1, color: "verde", modelo:"urbana"});
            Bicicleta.add(aBici, function(err, newBici){
              if (err) console.log(err);
              var aBici2 = new Bicicleta({code:2, color: "roja", modelo:"deportiva"});
              Bicicleta.add(aBici2, function(err, newBici){
                if (err) console.log(err);
                Bicicleta.findByCode(1, function(error, targetBici){
                  expect(targetBici.code).toBe(aBici.code);
                  expect(targetBici.color).toBe(aBici.color);
                  expect(targetBici.modelo).toBe(aBici.modelo);
                  done();
                });
              });
            });
          });
          
        });    
      });



  });

/*
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
        expect(response.status).toBe(200);
        let bici = response.data.bicicleta
        expect(bici.code).toBe(10)
        expect(bici.color).toBe(aBici.color)
        expect(bici.modelo).toBe(aBici.modelo)
        expect(bici.ubicacion[0]).toBe(Number(aBici.lat))
        expect(bici.ubicacion[1]).toBe(Number(aBici.lng))

    });
});
*/
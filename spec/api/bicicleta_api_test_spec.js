var Bicicleta = require('../../models/bicicleta');
var request = require('request');// library 

//the following runs the server one time 
//var server = require('../../bin/www'); //import server so take care your server has to be off


describe(' Bicicleta API', () =>{
    describe('GET BICICLETAS /', () =>{
        it('Status 200', ()=>{
            expect(Bicicleta.allBicis.length).toBe(0);

            var a =new Bicicleta(1,'rojo','urbana', [21.844862, -102.254499]);
            Bicicleta.add(a);//adding a bicicleta


            request.get('http://localhost:3000/api/bicicletas',function(error, response, body){
                expect(response.statusCode).toBe(200);
            });

        });
    });
});


describe('POST BICICLETAS/create', () =>{
   it('STATUS 200', (done)=>{
       var headers ={'content-type':'application/json'};
       var aBici= '{"id": 100 , "color":"rojo", "modelo":"pista", "lat":-34, "lng":-55 }';
       request.post({
           headers:headers,
           url: 'http://localhost:3000/api/bicicletas/create',
           body: aBici
       },function(error,response,body){
           expect(response.statusCode).toBe(200);
           expect(response.statusCode).toBe(200);
           //expect(Bicicleta.findById(10).color).toBe("rojo");


           done();//helps to tell a jasmine(library) wait for the execution of request to finalize the test
       });
   });
});

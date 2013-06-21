var baseDatos = {

	//Conectarse a la base de datos o crear una nueva
    abrirBD: function(){
        var db = openDatabase('dibam', '1.0', 'Dibam', 100 * 1024);
        return db;
    },
	//Creacion de Tablas
    tablaSolicitudesPorEnviar:function(tx){
        tx.executeSql('create table if not exists Solicitudes_por_enviar (isbn, nombre_libro, valor_referencia, cantidad, imagen )');
    },
    tablaPresupuestos:function(tx){

        tx.executeSql('create table if not exists Presupuestos (id unique, nombre, total, disponible, utilizado)');
        console.log('tabla presupuesto creada');
    },

    //inserts
	agregarSolicitud: function(tx, libro){
		var valor_referencia = libro.valor_referencia.replace('.','').replace(',','');
        tx.executeSql('insert into Solicitudes_por_enviar (isbn, nombre_libro, valor_referencia, cantidad, imagen) values ('+libro.isbn+', "'+libro.nombre_libro+'", '+valor_referencia+', '+libro.cantidad+', "'+libro.imagen+'")');
    },
    agregarPresupuesto: function(tx, presupuesto){
    	console.log(presupuesto);
        tx.executeSql('insert into Presupuestos (id, nombre, total, disponible, utilizado) VALUES ('+presupuesto.id+',"'+presupuesto.nombrePresupuesto+'",'+presupuesto.totalPresupuesto+','+presupuesto.disponiblePresupuesto+','+presupuesto.utilizado+')');
    },

    //Consultas
    verificarLibro: function(tx, libro){
    	tx.executeSql('select * from Solicitudes_por_enviar where isbn='+libro.isbn, [], function(tx, results){
    		if(results.rows.length == 0){
    			console.log('agregado');   			
    			baseDatos.agregarSolicitud(tx, libro);
    		}else{
    			alert('el libro ya se encuentra agregado');
    		}
    	}, baseDatos.errorGuardar);
    },

    verificarPresupuesto: function(tx, presupuesto){
    	tx.executeSql('select * from Presupuestos where id='+presupuesto.id, [], function(tx, results){
    		if(results.rows.length == 0){
    			console.log('agregado');   			
    			baseDatos.agregarPresupuesto(tx, presupuesto);
    		}else{
    			console.log('ya existe')
    			//alert('el libro ya se encuentra agregado');
    		}
    	}, baseDatos.errorGuardar);
    },

    obtenerPresupuesto: function(tx){
    	tx.executeSql('select * from Presupuestos', [], baseDatos.successPresupuestos, app.errorCB);
    },

    obtenerSolicitudesPorEnviar: function(tx) {
        tx.executeSql('select * from Solicitudes_por_enviar', [], baseDatos.successSolicitudesPorEnviar, app.errorCB);
    },

	borrarLibro: function(tx, isbn) {
        tx.executeSql('delete from Solicitudes_por_enviar where isbn='+isbn, [], baseDatos.successBorrarLibro, app.errorCB);
    },

    //Resultados
    successSolicitudesPorEnviar: function(tx, results){
    	var len = results.rows.length;
        console.log("Tabla SolicitiudesPorEnviar: " + len + " filas encontradas.");
        if(len >= 1){
		    for (var i=0; i<len; i++){
		    	var r = results.rows.item(i);
		    	window.montoUtilizado =window.montoUtilizado+(r.valor_referencia*r.cantidad);
		        var largoCadena = r.valor_referencia.toString().length;
		        var sobrante = largoCadena-3;
		        var valorDeReferencia = r.valor_referencia.toString().substring(0,sobrante)+'.'+r.valor_referencia.toString().substring(largoCadena-3,largoCadena);
		        var chk = '<input type="checkbox" name="checkbox-'+r.isbn+'" id="checkbox-'+r.isbn+'" class="custom"/> <label for="checkbox-'+r.isbn+'"><p class="label-sol"><img src="style/img/icons/solEnviadas.png" style="float:left;">'+r.nombre_libro+'<br/>Precio: $'+valorDeReferencia+'<br>Cantidad: '+r.cantidad +'<br /></p></label>';
		        $('#listadoSolicitudesPorEnviar').append(chk);
		    }
		}else{
			document.getElementById("sinResultadoSolicitud").innerHTML = 'Usted no tiene solicitudes por enviar.';			
			console.log('no tiene solicitudes por enviar');
		}
    },

    successPresupuestos: function(tx, results){
    	var len = results.rows.length;
        console.log("Tabla Presupuestos: " + len + " filas encontradas.");
        if(len >= 1){
		    for (var i=0; i<len; i++){
		        var r = results.rows.item(i);
		        document.getElementById("total_presupuesto").innerHTML = r.disponible- window.montoUtilizado;		
		       
		    }
		}else{
			console.log('no tiene solicitudes por enviar');
		}
    },

    successTablaSolicitudes: function(){
    	console.log('tabla solicitudes creada');
    },
    successGuardarLibro: function(){
    	console.log('Libro Creado Exitosamente');
    },

    //Errores de transaccion
    errorTablaSolicitudes: function(tx){
    	console.log("Error creando tabla solicitudes Codigo: "+tx.code);
        console.log("Error creando tabla solicitudess SQL: "+tx.message);
    },

    errorGuardarLibroerrorGuardarLibro: function(tx) {
        console.log("Error guardando libro SQL Codigo: "+tx.code);
        console.log("Error guardando libro SQL: "+tx.message);
    },


}
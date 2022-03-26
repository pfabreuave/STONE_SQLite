
			/*	 var catg = ["desc_categoria"]; */

			var catg =[
					 
					 ["Sim vendas"], 
					 ["Menos do que 10 Dias"], 
					 ["Entre 10 e 13 Dias"], 
					 ["Entre 14 e 18 Dias"], 
					 ["Entre 19 e 23 Dias"], 
					 ["Maior a 23 Dias"], 
					 ["TOTAL"]
					 ];	
					 
				 /*	 var cols = ["cinza", "vermelo", "amarelo", "verde", "amarelo", "vermelo", "verde", naranja]; */	
				 
				 var cols = ['003355', '#FF3030', '#ffff00', '#3cff00', '#f8c046', '#A52A2A', '#006400', '#ff8000'];
			var v = Number(0)		 
			var j = Number(0)	 
			var mirror = []		 
			var area_original = document.getElementById("tabla").innerHTML;		
			contenido.innerHTML = ' ';
			var categoria = Number(7);		 
			
			/*
				recibe los datos de las tabelas consolidadas de atendimientos y stock (JSON)
			*/	
			
			
			var url = "http://localhost:3000/stocks/";
			fetch(url, {method: 'GET'})
				.then((resp) => resp.json())
				.then(function(data){		
				mirror = data
				
				
				for(j=0;j<data.length;j++){ 
					mirror[j].polo = data[j].polo 
					mirror[j].stock = Number(data[j].stock)
					mirror[j].venda = Number(data[j].venda)
					mirror[j].dias_hab = Number(data[j].dias_hab)
					mirror[j].media = Number(data[j].media)
					mirror[j].auto = Number(data[j].auto)
					mirror[j].cat = Number(data[j].cat)
					mirror[j].rep = Number(data[j].rep)
					
				}
				seleccion_cuadros(7);
						
			})
				
			/*
			   	Actualiza stock
			*/
			function update_stock(upd_stock, j) {
				
				var polom = mirror[j].polo 
				var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				var raw = JSON.stringify({
					"stock": mirror[j].stock,
					"polo": mirror[j].polo
				});

				var requestOptions = {
					method: 'POST',
					headers: myHeaders,
					body: raw,
					redirect: 'follow'
				};

				
				
				var url = "http://localhost:3000/stock/";
				fetch(url, requestOptions)
					.then(raw=>{return raw})
					.then(res=>{console.log(res)}) 
					.catch(error=>console.log(error))
			}

			/*
				Buca un polo e devuelve un consolidado de las tabelas  de ATENDIMENTO E STOCK
									No habilitado
			*/

			function busca_um_polo(j) {
				var polom = mirror[j].polo
				var url = "http://localhost:3000/stock/" +polom;
				fetch(url, {method: 'GET'})
				.then((resp) => resp.json())
				.then(function(data){		
				})
			}

			/*
			   	busca un Polo por nombre en la tabela interna
			*/
					
			function buscarPL() {
				j = Number(0);
				userpl = document.getElementById("userpl");
				for(j=0;j<mirror.length;j++) {
						if (userpl.value == mirror[j].polo){
							buscack(j)
							j = 1 + mirror.stock.length;
							document.getElementById("userpl").value = "";
						};
					};
					if (j <= mirror.stock.length) {
						alert("Com licença, " +userpl.value+
						"  não encontrado,\ntente com otro,\n				                                    Obrigado ");
						document.getElementById("userpl").value = "";
					};			
			}

			/*
			   	busca un Polo onclick en la tabela interna	   
			*/

			function buscack(j) {
				if ((categoria == mirror[j].cat) || (categoria == 7)){
					document.getElementById('registro_'+j).className = 'parpadea';
					document.getElementById('reg_'+j).style.backgroundColor=cols[mirror[j].cat];
				}
				
				var respuesta =	confirm("Polo = "+mirror[j].polo+
								"\nCategoria = "+catg[mirror[j].cat]+
								"\nStock = "+mirror[j].stock+" unidades"+
								"\nVendas = "+mirror[j].venda+" unidades"+
								"\nMedia = "+mirror[j].media+" unidades por dia"+
								"\nAutonomia = "+mirror[j].auto+" Dias"+
								"\nReposicao = "+mirror[j].rep+" unidades"+
								"\n"+
								"\n Se voce deseja atualizar o estoque, Confirme");

				if(respuesta) {
					var upd_stock = (mirror[j].rep + " e o valor sugerido,");
			 		var nupd_stock = prompt (upd_stock +" se voce deseja alterar, insira um novo valor ")
			 		if (nupd_stock != 0){
						mirror[j].rep = Number(nupd_stock)
						mirror[j].stock = Number((mirror[j].rep + mirror[j].stock))
						mirror[j].auto = Math.round(mirror[j].stock / mirror[j].media)
						mirror[j].rep = Number(0)
						if (mirror[j].auto < 10){ 
					 		mirror[j].cat= Number(1);
					 		mirror[j].rep = Number((14 - mirror[j].auto) * mirror[j].media);	 
						}
						if ((mirror[j].auto >= 10) && (mirror[j].auto <= 13)){
						 	 mirror[j].cat= Number(2);
					 		 mirror[j].rep = Number((14 - mirror[j].auto) * mirror[j].media);
						}
						if ((mirror[j].auto >= 14) && (mirror[j].auto <= 18)){
							 mirror[j].cat= Number(3);
							 mirror[j].rep = Number(0);
						}
						if ((mirror[j].auto >= 19) && (mirror[j].auto <= 23)){
					 		 mirror[j].cat= Number(4);
					 		 mirror[j].rep = Number((14 - mirror[j].auto) * mirror[j].media);	
						}
						if (mirror[j].auto > 23){
					 		mirror[j].cat= Number(5);
					 		mirror[j].rep = Number((14 - mirror[j].auto) * mirror[j].media);	 
						}
			 		}
				 	else { 
						mirror[j].stock = Number((mirror[j].rep + mirror[j].stock))
						mirror[j].rep = Number(0)
						mirror[j].auto = Math.round(mirror[j].stock / mirror[j].media)
						mirror[j].cat = Number(3)	
					}

				/*
						AQUI LLAMADO AL UPDATE
				*/

					update_stock(+mirror[j].stock, j)
					confirm("stock atualizado com " +mirror[j].stock +" unidades; nova categoria " +catg[mirror[j].cat][0])
					seleccion_polo(j)
		 		} else {
					alert("Voce nao aceitou."); 						
		 		}            
			}

			/*
				 Lista cuadros de la categoria 
			*/
	
			function seleccion_cuadros(categoria) {	
				    contenido.innerHTML = ' ';
    				for(j=0;j<mirror.length;j++) {
						if ((mirror[j].cat == categoria) || (categoria == 7)) {	
							document.getElementById("contenido").innerHTML +=
							'<a  onclick="buscack('+j+')" id="registro_'+j+'"  class="card_SIN_VENTAS">'+mirror[j].polo+'</a>'
 							document.getElementById('registro_'+j).style.backgroundColor=cols[mirror[j].cat];  
						}				
    				}
			
				/*
				 	Lista detalhada de categorias 
				*/
					tabla.innerHTML = area_original;
					j = Number(0);
					var acumula_polos = Number(0);
					var acumula_vendas = Number(0);
					var acumula_rep = Number(0);
					var acumula_stock = Number(0);
				 	for(j=0;j<mirror.length;j++) {
						if ((mirror[j].cat == categoria) || (categoria == 7)) {
							acumula_polos = (acumula_polos + 1);
							acumula_stock = (mirror[j].stock + acumula_stock);
							acumula_vendas = (mirror[j].venda + acumula_vendas);
							acumula_rep = mirror[j].rep + acumula_rep;
							document.getElementById("tabla").innerHTML +=
							'<tr class="centrado" id="reg_'+j+'"><td class="campo_polo">'+mirror[j].polo+'</td><td>'
							+mirror[j].stock+'</td><td>'+mirror[j].venda+'</td><td>'
							+mirror[j].dias_hab+'</td><td>'+mirror[j].media+'</td><td>'
							+mirror[j].auto+'</td><td>'+mirror[j].rep+'</td></tr>' 
						}
						
					}
					/*
								 Lista totales detalhada de categorias 
					*/

    				if (categoria == 0) {
						acumula_vendas = 'Nenhuma venda no período examinado';
					}
					document.getElementById("tabla").innerHTML +=
					'<tr class="total_rep"><td>'+acumula_polos+'</td><td>'
					+acumula_stock+'</td><td>'+acumula_vendas+'</td><td>'
					+0+'</td><td>'+0+'</td><td>'+0+'</td><td>'
					+acumula_rep+'</td></tr>'			 	
			}

			/*
				 presenta cambios del polo seleccionado 
			*/
	
			function seleccion_polo(j) {	
				contenido.innerHTML = ' ';
				contenido.innerHTML +=` <div>
					<a class='mcard${mirror[j].cat}'>  ${mirror[j].polo} </a>
					<a class="mcard">STOCK  = ${mirror[j].stock} </a>
					<a class="mcard">VENDAS = ${mirror[j].venda} </a>
					<a class="mcard">DIAS-HAB = ${mirror[j].dias_hab} </a>
					<a class="mcard">MEDIA = ${mirror[j].media} </a>
					<a class="mcard">AUTONOMIA = ${mirror[j].auto} </a>
					<a class="mcard">REPOS = ${mirror[j].rep} </a>
 					</div>`	
			}
			
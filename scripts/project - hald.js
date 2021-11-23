// === constants ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === global variables  ===
// the total cost of selected products 
var total = 0;

// function called when page is loaded, it performs initializations 
var init = function() {
    createShop();
}
window.addEventListener("load", init);

// usefull functions
/*
 * create and add all the div.produit elements to the div#boutique element
 * according to the product objects that exist in 'catalog' variable
 */
var createShop = function () {

    var shop = document.getElementById("boutique");
    var elements = [];
    for(var i = 0; i < catalog.length; i++) {
        shop.appendChild(createProduct(catalog[i], i));
        elements[i]=catalog[i].name;
    }

    var filter= document.getElementById("filter");
    console.log ("filter = "+filter);
    filter.addEventListener ('keyup', function() {
        console.log (filter.value);
    })

    const searchinput = document.getElementById ("filter");

    searchinput.addEventListener("keyup",function() {
        let input = filter.value;
//console.log(elements);
        //elements.forEach(element => console.log(element));

        let x = elements.filter(element => !element.includes(input) );
        //console.log(x);

        for(i=0; i<x.length; i++) {
            let toFilterName = x[i];

            console.log(toFilterName);

            for(j=0; j < elements.length; j++) {
                if (toFilterName == elements[j]) {
                    let item = document.getElementById(j + "-product");
                    item.style.display = "none";
                }
            }
        }
    })

}

/*
 * create the div.produit elment corresponding to the given product
 * The created element receives the id "index-product" where index is replaced by param's value
 * @param product (product object) = the product for which the element is created
 * @param index (int) = the index of the product in catalog, used to set the id of the created element
 */
var createProduct = function(product, index) {
    // build the div element for product
    var block = document.createElement("div");
    block.className = "produit";
    // set the id for this product
    block.id = index + "-" + productIdKey;
    // build the h4 part of 'block'
    block.appendChild(createBlock("h4", product.name));

    // /!\ should add the figure of the product... does not work yet... /!\ 
    block.appendChild(createFigureBlock(product.image));

    // build and add the div.description part of 'block' 
    block.appendChild(createBlock("div", product.description, "description"));
    // build and add the div.price part of 'block'
    block.appendChild(createBlock("div", product.price, "prix"));
    // build and add control div block to product element

    block.appendChild(createOrderControlBlock(index));
    return block;
}


/* return a new element of tag 'tag' with content 'content' and class 'cssClass'
 * @param tag (string) = the type of the created element (example : "p")
 * @param content (string) = the html wontent of the created element (example : "bla bla")
 * @param cssClass (string) (optional) = the value of the 'class' attribute for the created element
 */
var createBlock = function(tag, content, cssClass) {
    var element = document.createElement(tag);
    if (cssClass != undefined) {
        element.className = cssClass;
    }
    element.innerHTML = content;
    return element;
}

/*
 * builds the control element (div.controle) for a product
 * @param index = the index of the considered product
 *
 * TODO : add the event handling, 
 *   /!\  in this version button and input do nothing  /!\  
 */
var createOrderControlBlock = function(index) {
    var control = document.createElement("div");
    control.className = "controle";

    // create input quantity element
    var input = document.createElement("input");
    input.id = index + '-' + inputIdKey;
    input.type = "number";
    input.value = "0";

    // add input to control as its child
    control.appendChild(input);

    // create order button
    var button = document.createElement("button");
    button.className = 'commander';
    button.id = index + "-" + orderIdKey;
    // add control to control as its child
    control.appendChild(button);

    // the built control div node is returned
    return control;
}


/*
 * create and return the figure block for this product
 * see the static version of the project to know what the <figure> should be
 * @param product (product object) = the product for which the figure block is created
 *
 * TODO : write the correct code
 */
var createFigureBlock = function(image) {
    let content = "<img src='./" + image + "'>";

    //var productsrc = product.image ; 
    return createBlock("figure", content);
}


//ajoute ou supprime des produits du panier
function manageCart(inputId, productIndex){
		
	//on selectionne notre input pour en récupèrer la valeur.
	let input = document.getElementById(inputId);
	//on récupère et converti en nombre la valeur de l'input.
	//let quantity =  Number(input.value);
	let quantity = input.value;
	
	//si la quantité est inférieure à 0 on supprime la miniature à droite
	if(quantity < 1){
		removeFromCart(productIndex);
	}
	else{		
		addCartSection(quantity,productIndex);
	}
	
	//on fait le compte du total
	countTotal();
}

function addCartSection(quantity,productIndex){
		
	// on cible toutes les balises de classe "achats" et on récupère seulement la première
	let section = document.getElementsByClassName('achats')[0];
	
	//on récupère le produit dans catalog[]
	let product = catalog[productIndex];
	
	let figure = document.getElementById("cartSection"+productIndex);	
	
	//si le produit n'est pas dans le panier
	if(figure == null){
		/*on crée un block figure et on l'ajoute directement au bloc achats (section).
		ça évite de refaire un if en fin de fonction et de créer une autre variable pour garder une trace de ce qui a été fait
		*/
		figure = createFigureBlock(product);
		section.appendChild(figure);	
	}
	//sinon on supprime le figcaption pour garder seulement l'image et ajouter a nouveau le reste
	else{
		figure.childNodes[1].remove();
	}
	
	//on crée de nouveaux blocs en utilisant la fonction déjà existante pour ça
	let caption = createBlock("figcaption",'','cartElement');
	let text = createBlock('span', quantity +' X ' + product.price + " = ",'');
	
	// on crée un noeud juste pour le prix il suffira plus tard de selectionner toutes les balises de cette classe et d'ajouter leur valeur pour avoir le total
	let price = createBlock('span', quantity * product.price ,'cartPrice');
	
	let btn= document.createElement('button');
	btn.className="retirer";	
	
	//on ajoute un event au clic au bouton pour supprimer la sous section et remettre à 0 la quantité du produit.
	btn.addEventListener('click',() => {removeFromCart(productIndex);},false);
		
	caption.appendChild(text);
	caption.appendChild(price);
	caption.appendChild(btn);
	figure.appendChild(caption);
	figure.id="cartSection"+productIndex;
	
}

function removeFromCart(productIndex){
	//on remet la quantité à 0
	let input = document.getElementById(productIndex+'-qte');
	input.value = 0;
	
	//on supprime l'encart à droite
	let element = document.getElementById('cartSection'+productIndex);
	element.remove();
	
	//on fait le compte du total
	countTotal();
}

//fait le total des achats
function countTotal(){
	
	let montant = document.getElementById('montant');	
	let total =0;
	//on récupère tous les sous totaux
	let prices = document.getElementsByClassName('cartPrice');
	/*
	// si on a des articles dans le panier
	if(prices.length > 0){
		//on lance un boucle sur prices pour additionner tous les prix;	
		//comme on a un objet et non un array on utilise Object.keys(prices)
		Object.keys(prices).forEach( function(index){
				
		//on ajoute nos valeurs tout en les convertissant en nombres.
			total = total + Number(prices[index].innerHTML);
		});

	}*/

	for (i=0; i<prices.length; i++) {
		total = total + parseInt(prices[i].innerHTML);
	}
	
	montant.innerHTML=total.toString();
}
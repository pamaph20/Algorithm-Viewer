function node(x, y, number){
    this.x = x;
    this.y = y;
    this.number = number;
    const edges = new Map();
    this.edges = edges;
    
}

/* May be Useless
 edge(node1, node2, weight){
    this.node1 = node1;
    this.node2 = node2;
    this.weight = weight;
}
*/

const nodeDict = new Map();
var count = 0;

jQuery(document).ready(function(){
     $("#special").click(function(e){ 
        

        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;


        count += 1;
        const newNode = new node(x, y, count);
        nodeDict.set(count, newNode);
          
        var ctx= this.getContext("2d"); 
        ctx.beginPath();
        ctx.arc(x, y, 10,0, 2*Math.PI);
        ctx.fill();

        $('#status2').html(count);
   }); 
})  

function showNodeDict(){
    let text = "";
    nodeDict.forEach (function(value, key) {
        text += key + ' = ' + value + ', ';
        }) 
    document.getElementById("demp").innerHTML = text;
    }

function newEdge(node1, node2, weight){  
    node1.edges.set(node2.number, weight);
    node2.edges.set(node1.number, weight);
    drawEdge(node1, node2);         
}       
           
function makeCompleteGraph(){
    for(const i of nodeDict.keys()){
        for (const j of nodeDict.keys()){
            newEdge(nodeDict.get(i), nodeDict.get(j), 5);
        }
    }
    document.getElementById("complete").innerHTML = 'worked';
    }


function drawEdge(node1, node2){
    var c = document.getElementById("special");
    var ctx= c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(node1.x, node1.y);
    ctx.lineTo(node2.x, node2.y);
    ctx.stroke();
}

function select_Nodes(){
    /*
    Select two nodes to be ran with the drawEdge Function
    */
}

function dragNode(){
    /*
    Select a pre-existing node and drag it around the canvas
    */
}

function deleteNode(){
    /*
    Select a pre-existing node and delete it from the canvas
    */
}

function clearCanvas(){
    nodeDict.clear();
    count = 0;
    $('#status2').html(count);
    var c = document.getElementById("special");
    var ctx= c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height)
}


//Dijkstra algorithm is used to find the shortest distance between two nodes inside a valid weighted graph. Often used in Google Maps, Network Router etc.

//helper class for PriorityQueue
class Node {
    constructor(val, priority) {
      this.val = val;
      this.priority = priority;
    }
  }
  
  class PriorityQueue {
    constructor() {
      this.values = [];
    }
    enqueue(val, priority) {
      let newNode = new Node(val, priority);
      this.values.push(newNode);
      this.bubbleUp();
    }
    bubbleUp() {
      let idx = this.values.length - 1;
      const element = this.values[idx];
      while (idx > 0) {
        let parentIdx = Math.floor((idx - 1) / 2);
        let parent = this.values[parentIdx];
        if (element.priority >= parent.priority) break;
        this.values[parentIdx] = element;
        this.values[idx] = parent;
        idx = parentIdx;
      }
    }
    dequeue() {
      const min = this.values[0];
      const end = this.values.pop();
      if (this.values.length > 0) {
        this.values[0] = end;
        this.sinkDown();
      }
      return min;
    }
    sinkDown() {
      let idx = 0;
      const length = this.values.length;
      const element = this.values[0];
      while (true) {
        let leftChildIdx = 2 * idx + 1;
        let rightChildIdx = 2 * idx + 2;
        let leftChild, rightChild;
        let swap = null;
  
        if (leftChildIdx < length) {
          leftChild = this.values[leftChildIdx];
          if (leftChild.priority < element.priority) {
            swap = leftChildIdx;
          }
        }
        if (rightChildIdx < length) {
          rightChild = this.values[rightChildIdx];
          if (
            (swap === null && rightChild.priority < element.priority) ||
            (swap !== null && rightChild.priority < leftChild.priority)
          ) {
            swap = rightChildIdx;
          }
        }
        if (swap === null) break;
        this.values[idx] = this.values[swap];
        this.values[swap] = element;
        idx = swap;
      }
    }
  }
  
  //Dijkstra's algorithm only works on a weighted graph.
  
  class WeightedGraph {
    constructor() {
      this.adjacencyList = {};
    }
    addVertex(vertex) {
      if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }
    addEdge(vertex1, vertex2, w) {
      this.adjacencyList[vertex1].push({ node: vertex2, w });
      this.adjacencyList[vertex2].push({ node: vertex1, w });
    }
    Dijkstra(start, finish) {
      const nodes = new PriorityQueue();
      const distances = {};
      const previous = {};
      let path = []; //to return at end
      let smallest;
      //build up initial state
      for (let vertex in this.adjacencyList) {
        if (vertex === start) {
          distances[vertex] = 0;
          nodes.enqueue(vertex, 0);
        } else {
          distances[vertex] = Infinity;
          nodes.enqueue(vertex, Infinity);
        }
        previous[vertex] = null;
      }
      // as long as there is something to visit
      while (nodes.values.length) {
        smallest = nodes.dequeue().val;
        if (smallest === finish) {
          //WE ARE DONE
          //BUILD UP PATH TO RETURN AT END
          while (previous[smallest]) {
            path.push(smallest);
            smallest = previous[smallest];
          }
          break;
        }
        if (smallest || distances[smallest] !== Infinity) {
          for (let neighbor in this.adjacencyList[smallest]) {
            //find neighboring node
            let nextNode = this.adjacencyList[smallest][neighbor];
            //calculate new distance to neighboring node
            let candidate = distances[smallest] + nextNode.w;
            let nextNeighbor = nextNode.node;
            console.log(smallest);
            console.log(candidate);
            console.log(nextNeighbor);
            console.log(distances[nextNeighbor]);
            if (candidate < distances[nextNeighbor]) {
              //updating new smallest distance to neighbor
              distances[nextNeighbor] = candidate;
              //updating previous - How we got to neighbor
              previous[nextNeighbor] = smallest;
              //enqueue in priority queue with new priority
              nodes.enqueue(nextNeighbor, candidate);
            }
          }
        }
      }
      return (path.concat(smallest).reverse());
    }
  }



const canvas = document.querySelector('canvas');
var width = document.getElementById('canvas').clientWidth
console.log(width)
const context = canvas.getContext('2d');
var g = new WeightedGraph();
var nodes = [];
var edges = [];
var radius = 55;
var weight;
var selection = undefined;
window.onmousemove = move;
window.onmousedown = down;
window.onmouseup = up;
function resize() {
    canvas.width = document.getElementById('canvas').clientWidth
    canvas.height = document.getElementById('canvas').clientHeight
    canvas.border =  'solid black';

}
window.onresize = resize;
resize();

function final(){
  let start = prompt("Please enter a start")
  let end = prompt("Please enter an end")
  console.log(nodes)
  while(isNaN(start)){
    start = prompt("Enter a valid integer weight")
  }
  while(isNaN(end)){
    end = prompt("Enter a valid integer weight");
  }

 

  var map = g.Dijkstra(start, end);
  console.log(g.Dijkstra(start,end));
  map = map.toString();
  var nodelist = map.split(",");
  console.log(nodelist);
  colorEdges(nodelist);
  document.getElementById("Final Path").innerHTML = "Shortest Path from " + start + " to " + end + " is: " + map.toString();
  

}

function within(x, y) {
    return nodes.find(n => {
        return x > (n.x - n.radius) && 
            y > (n.y - n.radius) &&
            x < (n.x + n.radius) &&
            y < (n.y + n.radius);
    });
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}


function down(e) {

  var checked = false
  var pos = getMousePos(canvas, e)
    /*
    find the node target, 
    if there is a selection clear the selected state, 
    then assign the selection to the target and set its selected state and draw
    mousedown when the selection changes to a new node and 
    we have something already selected we can create an edge
    */
  let target = within(pos.x , pos.y );
  if (selection && selection.selected) {
      selection.selected = false;
  }
  if (target) {
      if (selection && selection !== target) {
            if(!edgesExists(JSON.stringify(selection), JSON.stringify(target))){
                weight = prompt("Enter a weight");
                if (weight != null){
                  

                
                  while(isNaN(Number(weight)) && weight != null){
                    weight = prompt("Enter a valid integer weight");
                  }
                  if(weight != null){

                    checked = true;
                    weight = Number(weight);
                    edges.push({ from: selection, to: target, weight}); 
                    g.addEdge(selection.id, target.id, weight);
                  }            
                }
            }   
      }

      
      selection = target;
      selection.selected = true;

      draw();
      
      
  }
}


function edgesExists(S,T){ //S and T are just two variables for two different nodes
    for(let i = 0; i < edges.length; i++){
        sPrime = JSON.stringify(edges[i].from);
        tPrime = JSON.stringify(edges[i].to);
        if((S == sPrime && T == tPrime) || (T == sPrime && S == tPrime)){
            return true; // edge already exists
        }
    }
    return false;
}

//Draw the nodes, the clear rect is so it doesnt repeat drawing the nodes on a moues click 


function move(e) {
/*
if there is a selection and the mouse is currently down 
➡️ update selection x and y
*/
var pos = getMousePos(canvas, e);

  if (selection && e.buttons) {
      selection.x = pos.x;
      selection.y = pos.y;
      draw();
  }
}

function up(e) {
    /*
    if there is no selection then create a new node and draw, 
    otherwise if the current selection is not selected (because of mouse down) 
    then clear the selection and draw after
    */

  var pos = getMousePos(canvas, e);

  if (!selection) {
      let node = {
          id : nodes.length + 1,
          x: pos.x,
          y: pos.y,
          radius: radius,
          fillStyle: '#22cccc',
          strokeStyle: '#009999',
          selectedFill: '#88aaaa',
          selected: false
      };
      g.addVertex(node.id);
      nodes.push(node);
      draw();
  }
  if (selection && !selection.selected) {
      selection = undefined;
  }
  draw();
}


function draw() {
  
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < edges.length; i++) {
        //connecting existing nodes
        let fromNode = edges[i].from;
        let toNode = edges[i].to;
        console.log(fromNode.x, fromNode.y)
        console.log(toNode.x, toNode.y)
        context.beginPath();
        context.strokeStyle = fromNode.strokeStyle;
        context.moveTo(fromNode.x, fromNode.y);
        context.lineTo(toNode.x, toNode.y);
        context.lineWidth = 10;
        context.strokeStyle = "lightGrey";
        context.stroke();
        context.beginPath();
        context.textAlign='center';
        context.textBaseline='middle'
        let midx = ((toNode.x + fromNode.x) / 2);
        let midy = ((toNode.y + fromNode.y) / 2);
        context.fillText(edges[i].weight, midx, midy);
        context.stroke();
  
    }

    for (let i = 0; i < nodes.length; i++) {
        //drawing nodes
        let node = nodes[i];
        context.beginPath();
        context.fillStyle = node.selected ? node.selectedFill : node.fillStyle;
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
        context.strokeStyle = node.strokeStyle;
        context.fill();
        var font = "bold "+ radius / 2 + "px serif";
        context.textAlign='center';
        context.textBaseline='middle';
        context.font = font;
        context.fillStyle = "black";
        context.fillText(node.id, node.x, node.y, node.radius);
        context.stroke();
    }
  }


// Colors the edges that are used in the shortest path
function colorEdges(array){
  for(let i = 0; i< array.length -1; i++){
    redNode = parseInt(array[i]) -1;
    nextNode = parseInt(array[i + 1]) -1;
    context.beginPath();
    context.strokeStyle = "#FF0000";   
    context.moveTo(nodes[redNode].x, nodes[redNode].y);
    context.lineTo(nodes[nextNode].x, nodes[nextNode].y);
    context.stroke();
  }
}

function clearPage(){
  var emptynodes = [];
  var emptyedges = [];
  var newdict = {}
  g = new WeightedGraph();
  nodes = emptynodes;
  edges = emptyedges;
  dict = newdict;  
  context.clearRect(0, 0, 1500, 700);
  document.getElementById("Final Path").innerHTML = "Waiting to Run Shortest Path";
}



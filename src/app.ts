import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, PointerEventTypes, StandardMaterial, Color3, MeshBuilder, Mesh, Axis, Space, CSG, Color4 } from "@babylonjs/core";  
import { Grid } from "./grid";
import * as GUI from "@babylonjs/gui";

class App {

    //Fields used to store the grid and buttons at the top of the screen

    grid: Grid;
    textDisplay: GUI.Button;
    resetBut: GUI.Button;
    setFirstPlayer: GUI.Button;

    //Constructor that gets called to build the entire page

    constructor() {

        //create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        //initialize babylon scene, engine, camera, and lighting
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);
        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 8, new Vector3(0,7/8,0), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(0,3,0), scene);

        //Create grid and set the variable that keeps track of whose turn it is
        //to true so that X goes first by default
        this.grid = new Grid(scene);
        global.playerX = true;

        //Create and set the global materials that will be used for the
        //X and O models
        global.redMat = new StandardMaterial("redMat", scene);
        global.redMat.diffuseColor = Color3.Red();
        global.yellowMat = new StandardMaterial("yellowMat", scene);
        global.yellowMat.diffuseColor = Color3.Yellow();

        //Set the global variable that keeps track of how many squares are filled
        //to zero
        global.squaresFilled = 0;

        //Change the scene so that background has no color
        scene.clearColor = new Color4(0,0,0,0);

        //Create the middle button that displays whose turn it is, the reset button,
        //and the button that lets the user change who goes first
        this.textDisplay = this.createButton(1, scene, 2, 0, 3, "X's turn!", null);
        this.resetBut = this.createButton(2, scene, 2, 2, 3, "Reset Grid", () => {
            this.grid.resetGrid();
        });
        this.setFirstPlayer = this.createButton(3, scene, 2, -2, 3, "Switch First Player", () => {
            global.playerX = !global.playerX;
            this.grid.resetGrid();
            this.updateTurnText();
        })


        //Code to enable the Babylon.js inspector
        // scene.debugLayer.show();
        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        //Add the resize event listener to automatically resize the scene
        //if the window changes
        window.addEventListener("resize", function () {
            engine.resize();
        });
        

        //Adds a function that checks if there's been a game win or board fill
        //if the mouse is clicked on one of the square hitboxes. Also updates the player text
        scene.onPointerObservable.add((pointerInfo)=>{
            if(pointerInfo.type == PointerEventTypes.POINTERPICK && pointerInfo.pickInfo.pickedMesh.name.includes("square")){
                if(!this.checkWin()){
                    this.boardFillCheck(scene);
                    console.log("checked for WIN and FILL");
                }
                this.updateTurnText();
            }
        });


        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }

    //Checks if board is full and if so reset the grid for a new game
    boardFillCheck(scene: Scene){
        if(global.squaresFilled == 9){
            setTimeout(() => {
                alert("Board full! Resetting");
                this.grid.resetGrid();
            }, 50);
        }
    }

    //Function that checks if either player has one and resets it accordingly.
    //Wins will be determined based on whether the diagonals, horizontals, or verticals
    //equal 3 for an X win or -3 for an O win. Function returns true or false depending on if a winner
    //is found.
    checkWin(){

        //First calculate the value of the diagonals and then create variables to store
        //the horizontal and vertical values
        var diagonalDown: number = this.grid.grid[2][0].value + this.grid.grid[1][1].value + this.grid.grid[0][2].value;
        console.log("diagDown = " + diagonalDown);
        var diagonalUp: number = this.grid.grid[2][2].value + this.grid.grid[1][1].value + this.grid.grid[0][0].value;
        console.log("diagUp = " + diagonalUp);
        var horizontal: number;
        var vertical: number;

        //Use a for loop to go through all the vertical and horizontal sums
        //then check if any are -3 or 3, if they are alert the winner and reset the grid
        for(let i = 0; i < 3; i++){

            horizontal = this.grid.grid[i][0].value + this.grid.grid[i][1].value + this.grid.grid[i][2].value;
            vertical = this.grid.grid[0][i].value + this.grid.grid[1][i].value + this.grid.grid[2][i].value;

            if((horizontal) == 3 || (vertical) == 3 || diagonalDown == 3 || diagonalUp == 3){
                setTimeout(() => {
                    alert("X Wins!");
                    this.grid.resetGrid();
                }, 50);
                return true;
            }
            if((horizontal) == -3 || (vertical) == -3 || diagonalDown == -3 || diagonalUp == -3){
                setTimeout(() => {
                    alert("O Wins!");
                    this.grid.resetGrid();
                }, 50);
                return true;
            }
        }

        return false;
        
    }

    //Function used to create our buttons at the top of the screen according
    //to a defined style
    createButton(id, scene, planeSize, x, y, text, func){

        var plane = Mesh.CreatePlane("plane" + id, planeSize, scene);
        plane.position.x = x;
        plane.position.y = y;

        var texture = GUI.AdvancedDynamicTexture.CreateForMesh(plane);
        
        var tempButt = GUI.Button.CreateSimpleButton("but" + id, text);
        tempButt.width = 1;
        tempButt.height = 0.5;
        tempButt.fontSize = 100;
        
        if(func != null){
            tempButt.onPointerClickObservable.add(func);
        }

        texture.addControl(tempButt);

        return tempButt;

    }

    //Function that uses the global varialbe to keep track of turns
    //to update the text in the middle button
    updateTurnText(){

        if(global.playerX){
            this.textDisplay.textBlock.text = "X's turn!";
        }else{
            this.textDisplay.textBlock.text = "O's turn!";
        }
        
    }
}

//Build the app
new App();
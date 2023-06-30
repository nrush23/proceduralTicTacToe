import { Axis, Color3, Mesh, MeshBuilder, Scene, Space, StandardMaterial, Vector3 } from "@babylonjs/core";
import { Square } from "./square";

//GENERAL NOTE, OBJECTS GET CENTERED ON WORLD ORIGIN UPON CREATION
//WHEN TRANSLATING, KEEP IN MIND HALF OF THE WIDTH/HEIGHT/DEPTH HAVE TO BE
//ADDED IN ADDITION TO THE TRANSLATION

//Grid class store the Square hitboxes we create
//to position the X and O models and keep track of clicking
//and win values

export class Grid {

    //The 2D array keeps track of all the squares we generate
    grid: Square[][];

    //Only need scene to attach our meshes to
    constructor(scene: Scene) {

        //Materials to be used in constructing the game grid
        
        const blueMat = new StandardMaterial("blueMat");
        blueMat.diffuseColor = Color3.Blue();

        const blackMat = new StandardMaterial("blackMat");
        blackMat.diffuseColor = Color3.Black();

        //grid is a 2D array that contains all the squares that
        //a user will be able to place X's or O's

        //Make the grid by creating rows of squares
        //and adding the rows to the grid 2D array
        var grid: Square[][] = [];
        for (let i = 0; i < 3; i++) {
            var row: Square[] = [];
            for (let j = 0; j < 3; j++) {
                row[j] = new Square(i * 3 + j, scene);

                var translate: Vector3 = Vector3.Zero();
                translate._x = ((3/4 * j) - 3/4) * -1;
                translate._y = 3 / 4 * i;
                row[j].square.translate(translate, 1, Space.WORLD);
            }
            grid[i] = row;
        }

        this.grid = grid;

        //section to make the vertical bars between the squares
        for (let i = 1; i < 3; i++) {
            var bar: Mesh = MeshBuilder.CreateBox("bar" + i, { width: 1 / 4, height: 2, depth: 1 / 8 }, scene);
            bar.translate(new Vector3(Math.pow(-1, i) * (1 / 4 + 1 / 8), 6 / 8, 0), 1, Space.WORLD);
            bar.material = blackMat;

        }

        //section to make the horizontal bars between the squares
        for (let i = 1; i < 3; i++) {
            var bar: Mesh = MeshBuilder.CreateBox("bar" + i, { width: 1 / 4, height: 2, depth: 1 / 8 }, scene);
            bar.rotation.z = Math.PI/2;
            bar.translate(new Vector3(0, (1/8 + 1/4) + (i-1)*3/4,0),1, Space.WORLD);
            bar.material = blackMat;
        }

        //test function to see if the squares are generated correctly
        this.displayPositions();

    }

    //Function to see if the squares are aligned with the correct grid position
    displayPositions(){
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                console.log("(" + i + ", " + j + "): " + this.grid[i][j].square.name);
            }
        }
    }

    //Function to reset the grid by calling the reset square method
    //on each square and then setting the global squaresFilled variable
    //to zero
    resetGrid(){
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                this.grid[i][j].reset();
            }
        }
        global.squaresFilled = 0;
    }
}
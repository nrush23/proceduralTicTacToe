import { Material, PointerEventTypes, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { Mesh, MeshBuilder } from "@babylonjs/core/Meshes";
import { MeshButton3D} from "@babylonjs/gui";
import { PlayerMesh } from "./playerMesh";

//Class to generate the square hitboxes used to determine
//where a user places their model and set the values used for
//checking the wins or board fill
export class Square{

    //Square keeps track of the hitbox, playerPiece the model being placed in that spot,
    //value to keep track of who clicked it, and id and scene for naming and attaching
    //the meshes
    square: Mesh;
    playerPiece: PlayerMesh;
    value: number;
    id: number;
    scene: Scene;

    //name is the id for the square and scene where it gets attached to
    constructor(name: number, scene: Scene){

        //initialize invisible hitbox
        this.id = name;
        this.square = MeshBuilder.CreateBox("square" + name, {width: 1/2, height: 1/2, depth: 1/8}, scene);
        this.square.material = new StandardMaterial("square" + name, scene);
        this.square.material.alpha = 0;
        this.value = 0;
        this.scene = scene;

        //Add a click function that checks if the square was clicked on, if it's valid to update the value,
        //and if so, places the appropriate model and value and then updates how many square have been filled
        //and changes the turn
        scene.onPointerObservable.add((pointerInfo) => {
            if(pointerInfo.type == PointerEventTypes.POINTERPICK && pointerInfo.pickInfo.pickedMesh.name == this.square.name){
            if(this.value == 0){
                if(global.playerX){
                    this.playerPiece = new PlayerMesh(true, "x" + this.id, this.square.position, scene);
                    this.value = 1;
                }else{
                    this.playerPiece = new PlayerMesh(false, "o" + this.id, this.square.position, scene);
                    this.value = -1;
                }
                global.squaresFilled++;
                global.playerX = !global.playerX;
            }
        }
        });
    }

    //Function to reset the square by deleting the player model (X or O)
    //and setting the value to 0
    reset(){
        if(this.value!= 0){
            this.scene.removeMesh(this.playerPiece.mesh);
            this.value = 0;
        }
    }
}
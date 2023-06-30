import { Mesh, StandardMaterial } from "@babylonjs/core";

//Global variables used to keep track of whose turn it is,
//how many squares are filled, and the red and yellow materials
//used in the X and O models

declare global{
    var playerX: Boolean;
    var squaresFilled: number;
    var redMat: StandardMaterial;
    var yellowMat: StandardMaterial;
}

export{}
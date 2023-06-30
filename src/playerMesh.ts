import { Axis, CSG, Mesh, MeshBuilder, Scene, Space, Vector3 } from "@babylonjs/core";

//Class to generate the actual X or O models
export class PlayerMesh{

    //Only store the mesh data so we can transform the positions
    mesh: Mesh;

    //Use boolean to determine if an X or O need to be made, use name for the mesh name,
    //position to correctly align the model, and scene to put it in the world view

    constructor(x:boolean, name: string, position: Vector3, scene){
        if(x){
            this.createXMesh(name, position,);
        }else{
            this.createOMesh(name, position, scene);
        }
    }

    //Creates the X mesh by creating two rectangles, rotating them, and then
    //merging both models. Uses the global red material
    createXMesh(name: string, position: Vector3){

        this.mesh = MeshBuilder.CreateBox(name, {width: 1/16, height: 1/2, depth: 1/16});
        this.mesh.rotate(Axis.Z, Math.PI/4, Space.WORLD);

        var otherBar = this.mesh.clone(this.mesh.name + "Copy");
        otherBar.rotate(Axis.Z, Math.PI/2, Space.WORLD);

        this.mesh = Mesh.MergeMeshes([this.mesh, otherBar]);
        this.mesh.material = redMat;
        this.mesh.translate(position, 1, Space.WORLD);

    }

    //Creates the O mesh by creating two cylinders, the outer O ring and the "inner" O ring that
    //creates the O cutout. After subtracting the inner ring from the outer ring, create the mesh
    //and position it.
    createOMesh(name: string, position: Vector3, scene: Scene){

        //need to create temporary scene to hold the original cylinders and then clear them at the end

        var outerRingMesh: Mesh = MeshBuilder.CreateCylinder("outerRing", {height: 1/16, diameter: 2/5});
        var innerHoleMesh: Mesh = MeshBuilder.CreateCylinder("hole", {height: 1/16, diameter: 1/4});

        var outerRing = CSG.FromMesh(outerRingMesh);
        var innerHole = CSG.FromMesh(innerHoleMesh);

        var ring = outerRing.subtract(innerHole);
        this.mesh = ring.toMesh(name, yellowMat);

        scene.removeMesh(outerRingMesh);
        scene.removeMesh(innerHoleMesh);
        
        this.mesh.rotate(Axis.X, Math.PI/2, Space.WORLD);
        this.mesh.translate(position, 1, Space.WORLD);

    }
}
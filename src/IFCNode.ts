import {IFC4} from "web-ifc";
import { generateGlobalId } from "./utils";


export class IFCNode {
    private IFCAPI: any; 
    private modelId: number;
    private startingExpressId: number;
    public vertex: IFC4.IfcVertexPoint;

    constructor( ifcApi: any,
                 modelId: number,
                 expressID: number,
                 position?: number[],
                 geomContext?: IFC4.IfcGeometricRepresentationContext ){

        this.IFCAPI = ifcApi;
        this.startingExpressId = expressID;
        this.modelId = modelId;
    }

    public generateConnection( position: number[], geomContext: IFC4.IfcGeometricRepresentationContext ){

        //* IFCCARTESIANPOINT
        const origin = [
            new IFC4.IfcLengthMeasure(position[0]),
            new IFC4.IfcLengthMeasure(position[1]),
            new IFC4.IfcLengthMeasure(position[2]),
        ]

        const point = new IFC4.IfcCartesianPoint(
            this.startingExpressId++,
            origin
        )

        //* IFCVERTEXPOINT
        const vertex = new IFC4.IfcVertexPoint(
            this.startingExpressId++,
            point
        )

        this.vertex = vertex;

        //* IFCTOPOLOGYREPRESENTATION
        const topoRep = new IFC4.IfcTopologyRepresentation(
            this.startingExpressId++,
            geomContext,
            new IFC4.IfcLabel('Reference'),
            new IFC4.IfcLabel('Vertex'),
            [vertex]
        )

        //* IFCPRODUCTDEFINITIONSHAPE
        const productDefShape = new IFC4.IfcProductDefinitionShape(
            this.startingExpressId++,
            null,
            null,
            [topoRep]
        )

        //* IFCBOUNDARYNODECONDITION
        const boundCondition = new IFC4.IfcBoundaryNodeCondition(
            this.startingExpressId++,
            new IFC4.IfcLabel('Fixed'),
            null, null, null, null, null, null
        )

        //* IFCSTRUCTURALPOINTCONNECTION
        const connection = new IFC4.IfcStructuralPointConnection(
            this.startingExpressId++,
            generateGlobalId(),
            null,
            new IFC4.IfcLabel('Point Connection #1'),
            new IFC4.IfcText(''),
            null,
            null,
            productDefShape,
            boundCondition,
            null
        )

        // this.IFCAPI.WriteLine( this.modelId, connection );
        return connection;

    }

    public getMaxExpressId(){
        return this.startingExpressId;
    }

}
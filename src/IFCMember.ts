import {IFC4} from "web-ifc";
import { generateGlobalId } from "./utils";


export class IFCMember {
    private IFCAPI: any; 
    private modelId: number;
    private startingExpressId: number;
    public member: IFC4.IfcStructuralCurveMember;

    constructor( ifcApi: any,
                 modelId: number,
                 expressID: number,
                 position?: number[],
                 geomContext?: IFC4.IfcGeometricRepresentationContext ){

        this.IFCAPI = ifcApi;
        this.startingExpressId = expressID;
        this.modelId = modelId;
    }

    public generateMember(p1: IFC4.IfcVertexPoint,
                          p2: IFC4.IfcVertexPoint,
                          connection1: IFC4.IfcStructuralPointConnection,
                          connection2: IFC4.IfcStructuralPointConnection,
                          direction: IFC4.IfcDirection,
                          geomContext: IFC4.IfcGeometricRepresentationContext){

        
        const edge = new IFC4.IfcEdge( this.startingExpressId++, p1, p2);
        const topoRep = new IFC4.IfcTopologyRepresentation(
            this.startingExpressId++,
            geomContext,
            new IFC4.IfcLabel('Reference'),
            new IFC4.IfcLabel('Edge'),
            [edge]
        );

        const productDefShape = new IFC4.IfcProductDefinitionShape(
            this.startingExpressId++,
            null,null,
            [topoRep]
        );

        const member = new IFC4.IfcStructuralCurveMember(
            this.startingExpressId++,
            generateGlobalId(),
            null,
            new IFC4.IfcLabel('Curve Member #1'),
            new IFC4.IfcText(''),
            null,
            null,
            productDefShape,
            IFC4.IfcStructuralCurveMemberTypeEnum.RIGID_JOINED_MEMBER,
            direction
        )

        this.member = member;

        const memberConnectsRel1 = new IFC4.IfcRelConnectsStructuralMember(
            this.startingExpressId++,
            generateGlobalId(),
            null,
            new IFC4.IfcLabel(''),
            new IFC4.IfcText(''),
            member,
            connection1,
            null,null,null,null
        )

        const memberConnectsRel2 = new IFC4.IfcRelConnectsStructuralMember(
            this.startingExpressId++,
            generateGlobalId(),
            null,
            new IFC4.IfcLabel(''),
            new IFC4.IfcText(''),
            member,
            connection2,
            null,null,null,null
        )

        return {rel1: memberConnectsRel1, rel2: memberConnectsRel2}

    }

    public getMaxExpressId(){
        return this.startingExpressId;
    }
}
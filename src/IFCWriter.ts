import * as WebIFC from "web-ifc";
import * as path from "path";
import { generateGlobalId, saveModel } from './utils'
import {IFCNode} from './IFCNode';
import {IFCMember} from './IFCMember';


export class IFCWriter{

    private IFCAPI = new WebIFC.IfcAPI(); 
    private modelId: number;
    private maxExpressId: number = 0;
    
    
    constructor(){
        this.init();
    }

    async init(){
        await this.IFCAPI.Init();
        this.IFCAPI.SetWasmPath( path.join( __dirname, "../assets/wasm/") ); 

        const newIfcModel = {
            schema: WebIFC.Schemas.IFC4,
            name: 'Structural Model',
            description: ['Demo IFC Structural Model'],
            authors: ['Mazri A.'],
            organizations: []
        }

        this.modelId = this.IFCAPI.CreateModel( newIfcModel );

        const org = new WebIFC.IFC4.IfcOrganization(
            this.maxExpressId++,
            null,
            new WebIFC.IFC4.IfcLabel('Mazri'),
            null,null,null
        )

        this.IFCAPI.WriteLine( this.modelId, org );

        const app = new WebIFC.IFC4.IfcApplication(
            this.maxExpressId++,
            org,
            new WebIFC.IFC4.IfcLabel('0.0.1'),
            new WebIFC.IFC4.IfcIdentifier('my application'),
            new WebIFC.IFC4.IfcIdentifier('app')
        );

        this.IFCAPI.WriteLine( this.modelId, app );

        //Units 

        const unit_1 = new WebIFC.IFC4.IfcSIUnit(
            this.maxExpressId++,
            WebIFC.IFC4.IfcUnitEnum.LENGTHUNIT,
            WebIFC.IFC4.IfcSIPrefix.MILLI,
            WebIFC.IFC4.IfcSIUnitName.METRE
        );

        const unitAssign = new WebIFC.IFC4.IfcUnitAssignment(
            this.maxExpressId++,
            [unit_1]
        );

        this.IFCAPI.WriteLine( this.modelId, unitAssign );

        //Geom rep

        const origin = [
            new WebIFC.IFC4.IfcLengthMeasure(0),
            new WebIFC.IFC4.IfcLengthMeasure(0),
            new WebIFC.IFC4.IfcLengthMeasure(0),
        ]

        const cartPoint = new WebIFC.IFC4.IfcCartesianPoint(
            this.maxExpressId++,
            origin
        )
        this.IFCAPI.WriteLine( this.modelId, cartPoint );


        origin[2].value = 1;

        const dir = new WebIFC.IFC4.IfcDirection(
            this.maxExpressId++,
            origin
        )

        this.IFCAPI.WriteLine( this.modelId, dir );

        const axis = new WebIFC.IFC4.IfcAxis2Placement3D(
            this.maxExpressId++,
            cartPoint,
            null,
            null
        )

        this.IFCAPI.WriteLine( this.modelId, axis );


        const geomContex = new WebIFC.IFC4.IfcGeometricRepresentationContext(
            this.maxExpressId++,
            new WebIFC.IFC4.IfcLabel('3D'),
            new WebIFC.IFC4.IfcLabel('Model'),
            new WebIFC.IFC4.IfcDimensionCount(3),
            null,
            axis,
            dir
        )

        this.IFCAPI.WriteLine( this.modelId, geomContex );

        const proj = new WebIFC.IFC4.IfcProject(
            this.maxExpressId++,
            generateGlobalId(),
            null,
            new WebIFC.IFC4.IfcLabel('project'),
            new WebIFC.IFC4.IfcText('project desc'),
            null,
            null,
            null,
            [geomContex],
            unitAssign
        )

        this.IFCAPI.WriteLine( this.modelId, proj );

        // Spatial structure

        const site = new WebIFC.IFC4.IfcSite(
            this.maxExpressId++,
            generateGlobalId(),
            null,
            new WebIFC.IFC4.IfcLabel('my site'),
            new WebIFC.IFC4.IfcText(''),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        );
        this.IFCAPI.WriteLine( this.modelId, site);

        let relAggr = new WebIFC.IFC4.IfcRelAggregates(
            this.maxExpressId++,
            generateGlobalId(),
            null,
            null,
            null,
            proj,
            [site]
        );

        this.IFCAPI.WriteLine( this.modelId, relAggr );


        const building = new WebIFC.IFC4.IfcBuilding(
            this.maxExpressId++,
            generateGlobalId(),
            null,
            new WebIFC.IFC4.IfcLabel('building'),
            new WebIFC.IFC4.IfcText(''),
            null,
            null,null,null,null,null,null,null
        );

        this.IFCAPI.WriteLine( this.modelId,building );

        relAggr.expressID = this.maxExpressId++
        relAggr.GlobalId = generateGlobalId();
        relAggr.RelatedObjects = [building];
        relAggr.RelatingObject = site;

        this.IFCAPI.WriteLine( this.modelId, relAggr );

        const buildingStorey = new WebIFC.IFC4.IfcBuildingStorey(
            this.maxExpressId++,
            generateGlobalId(),
            null,
            new WebIFC.IFC4.IfcLabel('Level 0'),
            new WebIFC.IFC4.IfcText('Datum'),
            null,
            null,null,null,null,
            new WebIFC.IFC4.IfcPositiveLengthMeasure(0)
        );

        this.IFCAPI.WriteLine( this.modelId,buildingStorey );

        relAggr.expressID = this.maxExpressId++
        relAggr.GlobalId = generateGlobalId();
        relAggr.RelatedObjects = [buildingStorey];
        relAggr.RelatingObject = building;

        this.IFCAPI.WriteLine( this.modelId, relAggr );

        const elements = []


        /* Structural analysis model */
        const StrAnalysisModel = this.generateStructuralAnalysisModel();
        this.IFCAPI.WriteLine( this.modelId, StrAnalysisModel );

        const relDeclares = new WebIFC.IFC4.IfcRelDeclares(
            this.maxExpressId++,
            generateGlobalId(),
            null,
            new WebIFC.IFC4.IfcLabel('GROUP'),
            new WebIFC.IFC4.IfcText(''),
            proj,
            [StrAnalysisModel]
        )
        this.IFCAPI.WriteLine( this.modelId, relDeclares );


        /* NODES */
        const node1 = new IFCNode(this.IFCAPI, this.modelId, this.maxExpressId);
        const connection1 = node1.generateConnection([0,0,0], geomContex);
        this.IFCAPI.WriteLine( this.modelId, connection1 );
        this.maxExpressId = node1.getMaxExpressId();

        const node2 = new IFCNode(this.IFCAPI, this.modelId, this.maxExpressId);
        const connection2 = node2.generateConnection([0,0,1000], geomContex);
        this.IFCAPI.WriteLine( this.modelId, connection2 );
        this.maxExpressId = node1.getMaxExpressId();

        /* MEMBERS */
        const member1 = new IFCMember(this.IFCAPI, this.modelId, this.maxExpressId);
        const {rel1, rel2} = member1.generateMember( node1.vertex, node2.vertex, connection1, connection2, dir, geomContex);
        this.IFCAPI.WriteLine( this.modelId, rel1 ); 
        this.IFCAPI.WriteLine( this.modelId, rel2 );
        this.maxExpressId = node1.getMaxExpressId();
      
        /* assignment of connections and members to the analysis model */
        const groupRel = new WebIFC.IFC4.IfcRelAssignsToGroup(
            this.maxExpressId++,
            generateGlobalId(),
            null,
            new WebIFC.IFC4.IfcLabel(''),
            new WebIFC.IFC4.IfcText(''),
            [connection1, connection2],
            WebIFC.IFC4.IfcObjectTypeEnum.GROUP,
            StrAnalysisModel
        )
        this.IFCAPI.WriteLine( this.modelId, groupRel );

        /* Material profile set associated with each structural member */

        const profMaterial = new WebIFC.IFC4.IfcMaterial(
            this.maxExpressId++,
            new WebIFC.IFC4.IfcLabel('ASTM A36'),
            new WebIFC.IFC4.IfcText(''),
            new WebIFC.IFC4.IfcLabel('Steel'),
        )

        const shapeIProfDef = new WebIFC.IFC4.IfcIShapeProfileDef(
            this.maxExpressId++,
            WebIFC.IFC4.IfcProfileTypeEnum.AREA,
            new WebIFC.IFC4.IfcLabel('W10X30'),
            null,
            new WebIFC.IFC4.IfcPositiveLengthMeasure(5.81),
            new WebIFC.IFC4.IfcPositiveLengthMeasure(10.5),
            new WebIFC.IFC4.IfcPositiveLengthMeasure(0.3),
            new WebIFC.IFC4.IfcPositiveLengthMeasure(0.51),
            new WebIFC.IFC4.IfcPositiveLengthMeasure(0.125),
            null, null
        )

        const materialProf1 = new WebIFC.IFC4.IfcMaterialProfile(
            this.maxExpressId++,
            null,null,
            profMaterial,
            shapeIProfDef,
            null, null

        )
        const materialProfSet = new WebIFC.IFC4.IfcMaterialProfileSet(
            this.maxExpressId++,
            null,null,
            [materialProf1],
            null
        )

        const materialProfSetUsage = new WebIFC.IFC4.IfcMaterialProfileSetUsage(
            this.maxExpressId++,
            materialProfSet,
            null, null
        )

        const relAssociatesMaterial =  new WebIFC.IFC4.IfcRelAssociatesMaterial(
            this.maxExpressId++,
            generateGlobalId(),
            null,
            null, null,
            [member1.member],
            materialProfSetUsage
        )

        this.IFCAPI.WriteLine( this.modelId, relAssociatesMaterial );


        // TODO: *** Add to building storey ***
        elements.push(member1.member)
        const rel = new WebIFC.IFC4.IfcRelContainedInSpatialStructure(
            this.maxExpressId++,
            generateGlobalId(),
            null,
            null,
            null,
            elements,
            buildingStorey
        )

        this.IFCAPI.WriteLine( this.modelId, rel );
        saveModel(this.IFCAPI, this.modelId);
    }

    private generateStructuralAnalysisModel(){
        return new WebIFC.IFC4.IfcStructuralAnalysisModel(
            this.maxExpressId++,
            generateGlobalId(),
            null,
            new WebIFC.IFC4.IfcLabel('Structural Analysis #1'),
            new WebIFC.IFC4.IfcText(''),
            null,
            WebIFC.IFC4.IfcAnalysisModelTypeEnum.NOTDEFINED,
            null,
            null,null,null
        );
    }


}
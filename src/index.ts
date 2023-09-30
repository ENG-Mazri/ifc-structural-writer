import { IFCWriter } from "./IFCWriter";

const ifcWriter = new IFCWriter();



// const profile = new WebIFC.IFC4.IfcRectangleProfileDef(
//     this.maxExpressId++,
//     WebIFC.IFC4.IfcProfileTypeEnum.AREA,
//     new WebIFC.IFC4.IfcLabel('rectangular profile'),
//     null,
//     new WebIFC.IFC4.IfcPositiveLengthMeasure(300),
//     new WebIFC.IFC4.IfcPositiveLengthMeasure(400)
    
// )

// this.IFCAPI.WriteLine( this.modelId, profile );


// const extSolid = new WebIFC.IFC4.IfcExtrudedAreaSolid(
//     this.maxExpressId++,
//     profile,
//     axis,
//     dir,
//     new WebIFC.IFC4.IfcPositiveLengthMeasure(4000)
// )

// this.IFCAPI.WriteLine( this.modelId, extSolid  );

// const shapeRep = new WebIFC.IFC4.IfcShapeRepresentation(
//     this.maxExpressId++,
//     geomContex,
//     new WebIFC.IFC4.IfcLabel('Body'),
//     new WebIFC.IFC4.IfcLabel('sweptSolid'),
//     [extSolid]
// )
// this.IFCAPI.WriteLine( this.modelId, shapeRep  );


// const productDef = new WebIFC.IFC4.IfcProductDefinitionShape(
//     this.maxExpressId++,
//     null,
//     null,
//     [shapeRep]
// )

// this.IFCAPI.WriteLine( this.modelId, productDef );

// const column = new WebIFC.IFC4.IfcColumn(
//     this.maxExpressId++,
//     generateGlobalId(),
//     null,
//     new WebIFC.IFC4.IfcLabel('m_column'),
//     new WebIFC.IFC4.IfcText('column desc'),
//     null,
//     null,
//     productDef,
//     new WebIFC.IFC4.IfcIdentifier('a234234'),
//     WebIFC.IFC4.IfcColumnTypeEnum.NOTDEFINED
// )

// this.IFCAPI.WriteLine( this.modelId, column  );


// // styling

// const color = new WebIFC.IFC4.IfcColourRgb(
//     this.maxExpressId++,
//     null,
//     new WebIFC.IFC4.IfcNormalisedRatioMeasure(0.5),
//     new WebIFC.IFC4.IfcNormalisedRatioMeasure(0.5),
//     new WebIFC.IFC4.IfcNormalisedRatioMeasure(0.5),
// );
// this.IFCAPI.WriteLine( this.modelId, color);

// const srfStyleRendering = new WebIFC.IFC4.IfcSurfaceStyleRendering(
//     this.maxExpressId++,
//     color,
//     new WebIFC.IFC4.IfcNormalisedRatioMeasure(0.0),
//     new WebIFC.IFC4.IfcNormalisedRatioMeasure(0.8),
//     null,
//     null,
//     null,
//     null,
//     null,
//     WebIFC.IFC4.IfcReflectanceMethodEnum.NOTDEFINED
// );
// this.IFCAPI.WriteLine( this.modelId, srfStyleRendering);

// const srfStyle = new WebIFC.IFC4.IfcSurfaceStyle(
//      this.maxExpressId++,
//     new WebIFC.IFC4.IfcLabel('my surface style'),
//     WebIFC.IFC4.IfcSurfaceSide.BOTH,
//     [srfStyleRendering] 
// );

// this.IFCAPI.WriteLine( this.modelId, srfStyle);

// const styledItem = new WebIFC.IFC4.IfcStyledItem(
//     this.maxExpressId++,
//     extSolid,
//     [srfStyle],
//     null

// )
// this.IFCAPI.WriteLine( this.modelId, styledItem);
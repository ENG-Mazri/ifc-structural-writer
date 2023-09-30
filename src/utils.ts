import * as WebIFC from "web-ifc";
import {v4 as uuidv4} from 'uuid';
import * as uuid from 'uuid';
import * as d64 from 'd64';
import * as fs from 'fs';
import * as path from "path";


export function generateGlobalId(): WebIFC.IFC4.IfcGloballyUniqueId {
    return new WebIFC.IFC4.IfcGloballyUniqueId( d64.encode(uuid.parse( uuidv4())) );
}

export function saveModel( ifcApi: any, modelId: number, name: string = 'structural_model.ifc'): void {
    const bin = ifcApi.SaveModel(modelId);        

    const dir = path.join( __dirname, '../assets/ifcFiles' );

    if ( !fs.existsSync( dir ) ) fs.mkdirSync( dir );
    fs.writeFileSync( path.join(dir, name), bin );
}
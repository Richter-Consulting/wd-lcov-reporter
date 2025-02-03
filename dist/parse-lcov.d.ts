import { LcovDocumentType, LcovParserConfigType } from './types';
export declare function parseLcov({ lcovFilePath, excludeFiles }: LcovParserConfigType): Promise<LcovDocumentType[]>;

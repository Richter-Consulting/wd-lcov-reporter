import type { LcovDocumentType } from './types';
export declare function calculateOverallCoverage(lcovDocuments: LcovDocumentType[]): string;
export declare function renderAsMardownTable(lcovDocuments: LcovDocumentType[]): string;

export namespace Sitecore {
  export namespace Rainbow {
    export interface IField {
      ID: string;
      Hint: string;
      Type?: string;
      Value: string;
    }

    export interface ILanguage {
      Language: string;
      Versions?: IVersion[];
    }

    export interface IVersion {
      Version: number;
      Fields?: IField[];
    }

    export interface IItem {
      ID: string;
      Parent: string;
      Template: string;
      Path: string;
      DB: string;
      SharedFields?: IField[];
      Languages?: ILanguage[];
    }
  }

  export namespace CodeGeneration {
    export interface IField {
      // Sitecore
      ID: string;
      Name: string;
      Type: string;

      // Code Generation
      AsProperty: string;
      AsPropertyType: string;
    }

    export interface ITemplate {
      // Sitecore
      ID: string;
      Name: string;
      Path: string;
      Fields: IField[];
      BaseTemplates: ITemplate[];

      // Code Generation
      AsNamespace: string;
      AsClass: string;
      AsInterface: string;

      // internal calculations
      OwnFields: IMap<IField>;
      InheritedFields: IMap<IField>;
    }
  }
}

export interface IMap<T> {
  [index: string]: T;
}

export interface IOptions {
  cwd: string;
  pattern: string | string[];

  templatePath?: string;

  Using?: string[];

  ToClass?: Function;
  ToInterface?: Function;
  ToNamespace?: Function;

  ToProperty?: Function;
  ToPropertyType?: Function;
}

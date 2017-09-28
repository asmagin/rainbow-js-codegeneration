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
    export interface IFieldBase {
      ID: string;
      Name: string;
      Type: string;
    }

    export interface ITemplateBase {
      ID: string;
      Name: string;
      Path: string;
      Fields: IMap<IField>;
      BaseTemplates: ITemplate[];
    }
  }

  export namespace CodeGeneration {
    export interface IField extends IFieldBase {
      PropertyName: string;
    }

    export interface ITemplate extends ITemplateBase {
      OwnFields: IMap<IField>;
      InheritedFields: IMap<IField>;

      Namespace: string;

      ClassName: string;
      InterfaceName: string;
    }
  }
}

export interface IMap<T> {
  [index: string]: T;
}

export interface IOptions {
  cwd: string;
  pattern: string | string[];
  ToClass?: Function;
  ToInterface?: Function;
  ToNamespace?: Function;
}

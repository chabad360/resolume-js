import {components} from "./schema";

export enum ActionType {
    Set = "set",
    Trigger = "trigger",
    Subscribe = "subscribe",
    Unsubscribe = "unsubscribe",
    Post = "post",
}

export interface PostAction {
    action: ActionType.Post;
    path: string;
    body?: string;
    id?: string;
}

export interface SetAction {
    action: ActionType.Set;
    parameter: string;
    value: any;
}

export interface TriggerAction {
    action: ActionType.Trigger;
    parameter: string;
    value?: boolean;
}

export interface SubscribeAction {
    action: ActionType.Subscribe | ActionType.Unsubscribe;
    parameter: string;
}

export type Action = PostAction | SetAction | TriggerAction | SubscribeAction;

export enum MessageType {
    Subscribed = "parameter_subscribed",
    Unsubscribed = "parameter_unsubscribed",
    ParameterUpdate = "parameter_update",
    ParameterSet = "parameter_set",
    SourcesUpdate = "sources_update",
    EffectsUpdate = "effects_update",
}

export interface TriggerParameter {
    valuetype: "ParamTrigger";
    id: number;
    value?: boolean;
}

type ValueType<Type, vt extends string> = {
    [Property in keyof Type as Exclude<Property, "view">]-?: Type[Property] ;
} & {
    valuetype: vt;
    view?: never;
}

export type StringParameter = ValueType<components["schemas"]["StringParameter"], "ParamString">

export type TextParameter = ValueType<components["schemas"]["TextParameter"], "ParamText">

export type BooleanParameter = ValueType<components["schemas"]["BooleanParameter"], "ParamBoolean">

export type IntegerParameter = ValueType<components["schemas"]["IntegerParameter"], "ParamInteger">

export type ColorParameter = ValueType<components["schemas"]["ColorParameter"], "ParamColor">

export type RangeParameter = ValueType<components["schemas"]["RangeParameter"], "ParamRange">

export type ChoiceParameter = ValueType<components["schemas"]["ChoiceParameter"], "ParamChoice">

export type StateParameter = ValueType<components["schemas"]["ChoiceParameter"], "ParamState">

export type EventParameter = ValueType<components["schemas"]["EventParameter"], "ParamEvent">

export type Parameter = StringParameter |
    TextParameter |
    BooleanParameter |
    IntegerParameter |
    ColorParameter |
    RangeParameter |
    ChoiceParameter |
    StateParameter |
    // EventParameter |
    TriggerParameter;

export type ParameterMessage = Parameter & {
    type: MessageType.ParameterUpdate | MessageType.ParameterSet | MessageType.Subscribed | MessageType.Unsubscribed;
    path: string;
}

export function isParameterMessage(message: Message): message is ParameterMessage {
    return (message as ParameterMessage).type === MessageType.ParameterUpdate
        || (message as ParameterMessage).type === MessageType.ParameterSet
        || (message as ParameterMessage).type === MessageType.Subscribed
        || (message as ParameterMessage).type === MessageType.Unsubscribed;
}

export interface SourcesMessage {
    type: MessageType.SourcesUpdate;
    value: components["schemas"]["Sources"];
}

export function isSourcesMessage(message: Message): message is SourcesMessage {
    return (message as SourcesMessage).type === MessageType.SourcesUpdate;
}

export interface Effect {
    idstring: string;
    name: string;
    presets: {
        id: number;
        name: string;
    }[]
}

export interface EffectsMessage {
    type: MessageType.EffectsUpdate;
    value: {
        Video: Effect[],
        Audio: Effect[],
    }
}

export function isEffectMessage(message: Message): message is EffectsMessage {
    return (message as EffectsMessage).type === MessageType.EffectsUpdate;
}

export interface ErrorMessage {
    error: string | null;
    id?: number | null;
    path?: string | null;
}

export function isErrorMessage(message: Message): message is ErrorMessage {
    return (message as ErrorMessage).error !== undefined;
}

export type TypedMessage = ParameterMessage | SourcesMessage | EffectsMessage;

export type Composition = components["schemas"]["Composition"]

export type Message = TypedMessage | Composition | ErrorMessage;

export function isCompositionMessage(message: Message): message is Composition {
    return (message as Composition).name !== undefined;
}
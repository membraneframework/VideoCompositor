"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_js_1 = require("../component.js");
const Shader = (0, component_js_1.createCompositorComponent)(sceneBuilder);
function sceneBuilder(props, children) {
    return {
        type: 'shader',
        children: children.map(component_js_1.sceneComponentIntoApi),
        id: props.id,
        shader_id: props.shaderId,
        shader_param: props.shaderParam && intoShaderParams(props.shaderParam),
        resolution: props.resolution,
    };
}
function intoShaderParams(param) {
    if (param.type === 'f32') {
        return {
            type: 'f32',
            value: param.value,
        };
    }
    else if (param.type === 'u32') {
        return {
            type: 'u32',
            value: param.value,
        };
    }
    else if (param.type === 'i32') {
        return {
            type: 'i32',
            value: param.value,
        };
    }
    else if (param.type === 'list') {
        return {
            type: 'list',
            value: param.value.map(intoShaderParams),
        };
    }
    else if (param.type === 'struct') {
        return {
            type: 'struct',
            value: param.value.map(intoShaderStructField),
        };
    }
    else {
        throw new Error('Invalid shader params');
    }
}
function intoShaderStructField(param) {
    if (param.type === 'f32') {
        return {
            type: 'f32',
            value: param.value,
            field_name: param.fieldName,
        };
    }
    else if (param.type === 'u32') {
        return {
            type: 'u32',
            value: param.value,
            field_name: param.fieldName,
        };
    }
    else if (param.type === 'i32') {
        return {
            type: 'i32',
            value: param.value,
            field_name: param.fieldName,
        };
    }
    else if (param.type === 'list') {
        return {
            type: 'list',
            value: param.value.map(intoShaderParams),
            field_name: param.fieldName,
        };
    }
    else if (param.type === 'struct') {
        return {
            type: 'struct',
            value: param.value.map(intoShaderStructField),
            field_name: param.fieldName,
        };
    }
    else {
        throw new Error('Invalid shader params');
    }
}
exports.default = Shader;

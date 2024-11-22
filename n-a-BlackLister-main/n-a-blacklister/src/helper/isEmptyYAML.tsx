import * as jsYaml from 'js-yaml'

export function isEmptyYAML(yamlString: string): boolean {
    try {
        const parsedYAML = JSON.stringify(jsYaml.load(yamlString));
        
        // Check if parsedYAML is an object and if it has any keys
        return typeof parsedYAML === 'object' && Object.keys(parsedYAML).length === 0; 

    } catch (error) {
        return false;
    }
}
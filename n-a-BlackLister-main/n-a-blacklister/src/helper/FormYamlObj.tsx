import { nsLogger } from "../Logging/Logger.js"
import { IFormsField } from "../types/IForm.js"
import yamlObject from "../types/Iyaml_JS.js"
import { rulingList } from "./AutoMod.js"

export async function createYamlFormObject(
  Rulings: rulingList, 

): Promise<string> {
    let disc = ''

    let formObj: IFormsField = {
        fields: []
    }
    if(Rulings.rules === undefined){
        return '-1'
    }

    for(let item of Rulings.rules){
        let test = item as yamlObject

        console.log(`items: ${test}`)

        formObj.fields.push(
            {
                type: 'string', 
                name: `${test.type}`, 
                label: ``, 
                //defaultValue: defualtPostiton,
                helpText: disc,
            }
        );

        // let disabled = false
        // let defualtPostiton = true

        // if (Object.keys(Rulings.rule).length > 0){
        // if(Rulings.rule[Rulings.domainTitle].indexOf(validLinks[item]) != -1 ){
        //     disabled = true
        //     defualtPostiton = false
        // }
        // }

        // for(let x of Ftypes[1]){
        //     formObj.fields.push(
        //     {
        //         type: x, 
        //         name: `${validLinks[item]}`, 
        //         label: `${validLinks[item]}`, 
        //         disabled: disabled,
        //         defaultValue: defualtPostiton,
        //         helpText: disc,
        //     }
        //     );
        // }
    }

    const NewFromObj = {
    title: 'Auto-Mod Rules',
    description: 'List of the AutoMod Rules',
    fields: [
      {
        type: 'group',
        label: disc,
        fields: JSON.parse(JSON.stringify(formObj.fields)),
      },
    ],
    acceptLabel: 'Submit',
    cancelLabel: 'Cancel'
  }
  
  const NewFromJsonString = JSON.stringify(NewFromObj);

  nsLogger('Form Object built', createYamlFormObject.name)

  return NewFromJsonString
}
  
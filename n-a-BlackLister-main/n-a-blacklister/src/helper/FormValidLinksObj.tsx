import { nsLogger } from "../Logging/Logger.js"
import { IFormsField } from "../types/IForm.js"
import { rulingList } from "./AutoMod.js"

export async function createValidLinksFormObject(
  Rulings: rulingList, 
  Ftypes?: [string, string[]],

  validLinks?: string[], 
): Promise<string> {
  let disc = ''

  let formObj: IFormsField = {
    fields: []
  }

  if(Ftypes === undefined){
  }

  // build form object?
  if((validLinks && validLinks.length > 0) && (Ftypes)){

    for(let item in validLinks){
      let disabled = false
      let defualtPostiton = true

      if (Object.keys(Rulings.rule).length > 0){
        if(Rulings.rule[Rulings.domainTitle].indexOf(validLinks[item]) != -1 ){
          disabled = true
          defualtPostiton = false
        }
      }

      if(Ftypes[1].length > 1){
        for(let x of Ftypes[1]){
          formObj.fields.push(
            {
                type: x, 
                name: `${validLinks[item]}`, 
                label: `${validLinks[item]}`, 
                disabled: disabled,
                defaultValue: defualtPostiton,
                helpText: disc,
            }
          );
        }
      } else {
        formObj.fields.push(
          {
              type: Ftypes[1][0], 
              name: `${validLinks[item]}`, 
              label: `${validLinks[item]}`, 
              disabled: disabled,
              defaultValue: defualtPostiton,
              helpText: disc,
          }
        );
      }
    }

  } else {
    
  }


  const NewFromObj = {
    title: 'URLs Found!',
    description: 'Please Select Links to be Remove',
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

  nsLogger('Form Object built', createValidLinksFormObject.name)

  return NewFromJsonString
}
  
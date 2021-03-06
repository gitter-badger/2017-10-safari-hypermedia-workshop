/*******************************************************
 * task service implementation
 * json representor w/ FORM profile (server)
 * Mike Amundsen (@mamund)
 *******************************************************/

// json representor
// w/ profile=forms
// strip out action info
module.exports = json;

function json(object) {
  var i, x;
  var actions;
    
  for (var p in object) {
    switch (p) {
    case "actions":
      delete object[p];
      break;
    case "todo":
    default:
      actions = object[p].actions;

      if (object[p].data) {
        object[p] = object[p].data;
        delete object[p].data;

        // selected actions
        object.actions = {};
        for(i=0,x=actions.length;i<x;i++) {
          switch (actions[i].name) {
            case "listAll":
              object.actions.collection = {
                href: actions[i].href,
                prompt: actions[i].prompt,
                rel: actions[i].rel
              };
              break;
            case "listActive":
              object.actions.active = {
                href: actions[i].href+"?completed=false",
                prompt: actions[i].prompt,
                rel: actions[i].rel
              };
              break;
            case "listCompleted":
              object.actions.completed = {
                href: actions[i].href+"?completed=true",
                prompt: actions[i].prompt,
                rel: actions[i].rel
              };
              break;            
            case "addForm":
              object.actions.add = {
                href: actions[i].href,
                prompt: actions[i].prompt,
                rel: actions[i].rel,
                method:"POST",
                args : {
                    title: {value:"", prompt:"Title", required:true},
                    email: {value:"", prompt:"Email", required:false},
                    completed: {value:"false", prompt:"Completed", pattern:"^(true|false)$"},
                    tags: {value:"", prompt:"Tags", required:false}
                }
              };
              break;            
            case "editForm":
              object.actions.edit = {
                href: actions[i].href,
                prompt: actions[i].prompt,
                rel: actions[i].rel,
                method:"PUT",
                args:{
                  id: {value:"{id}", prompt:"Id", readOnly:true},
                  title: {value:"{title}", prompt:"Title", required:true},
                  email: {value:"{email}", prompt:"Email", required:false},
                  completed: {value:"{completed}", prompt:"Completed", pattern:"^(true|false)$"},
                  tags: {value:"{tags}", prompt:"Tags", required:false}
                }
              };
              break;            
            case "removeForm":
              object.actions.remove = {
                href: actions[i].href,
                prompt: actions[i].prompt,
                rel: actions[i].rel,
                method:"DELETE",
                args:{
                  id: {value:"{id}", prompt:"Id", readOnly:true}
                }
              };
              break;            
            case "searchForm":
              object.actions.search = {
                href: actions[i].href,
                prompt: actions[i].prompt,
                rel: actions[i].rel,
                method:"GET",
                args:{
                  tags: {value:"", prompt:"Tags", required:true}
                }
              };
              break;            
          }
        }

        // annotated data
        for(i=0,x=object[p].length;i<x;i++) {
          object[p][i].href = object[p][i].meta.href;
          delete object[p][i].meta;
        } 
      } 
      break;
    }
  }

  return JSON.stringify(object, null, 2);
}

// EOF


import axios from "axios";
import path from "path"

export function fetchList(url) {
     
    // require(path.join(__dirname,url))
    return fetch(url).then(code =>{
            return code.text()
            
        })
}
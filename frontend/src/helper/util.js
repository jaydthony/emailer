function msg(resp){
    if (typeof resp == "object") {
        if (resp.hasOwnProperty("status") && resp.status == true) {
          if (resp.hasOwnProperty("data")) {
            if (typeof resp.data == "String") {
              alertMsg(resp.data);
            }
            if (typeof resp.data == "Array") {
              alertMsg(resp.data.join(","));
            }
          }
        }
      }
}
function alertMsg(data, type="info"){
    alert(data)
}
export{
    alertMsg
}
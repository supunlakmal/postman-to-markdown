"use strict";
 class PostmanMD {
    constructor(e) {

this.respond =  e.withRespond;

    }
    responsesData(data) {
      let responses = `<br> ## ${data.name}
                      <br>
                      <br> **Code** : \`${data.code}\`
                      <br>
                      <br> **Content example**
                      <br>
                      <br> \`\`\`json
                      <br> ${data.body}
                      <br> \`\`\`
                      <br>`;
      return responses;
    }
    mdOutput(val) {
      let self = this;
      let header = '';
      jQuery.each(val.request.header, function (i, sub) {
        header += `"${sub.key}" : "${sub.value}"<br>`;
        
      });



      let responses = '';


      if(self.respond){
      jQuery.each(val.response, function (i, sub) {
        responses += self.responsesData(sub);
        console.log(sub);
      });
    }
      let md = `# ${val.name}
                <br> ${val.request.description}
                <br>
                <br> **URL** : \`${val.request.url.raw}\`
                <br>
                <br> **Method** : \`${val.request.method}\`
                <br>
                <br> **Request Header**
                <br>
                <br> \`\`\`json
                <br> {
                <br> ${header} }
                <br> \`\`\`
                <br>
                <br> **Request Body**
                <br>
                <br> \`\`\`json
                <br> ${val.request.body.raw}
                <br> \`\`\`
                <br> ${responses}
                <br>
                <br> ---
                <br>
                `;
      return md;
    }
    getJsonData(data) {

      let self = this;

      jQuery.each(data.item, function (i, val) {
        // console.log(i,val);
        if (val.request) {
          console.log(i, val.name, val);
          $('#md').append(self.mdOutput(val));
        } else {
          self.getJsonData(val);
        }
      });
    }
    readJsonFile(file) {
      let self = this;
      let rawFile = new XMLHttpRequest();
      rawFile.overrideMimeType("application/json");
      rawFile.open("GET", file, true);
      rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
          //callback(rawFile.responseText);
          let data = JSON.parse(rawFile.responseText);
          self.getJsonData(data);
        }
      }
      rawFile.send(null);
    }
  }
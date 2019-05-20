'use strict';
/**
 * PostMan to  markdown class
 */
class PostmanMD {
  /**
   *
   * @param {object} e
   */
  constructor(e) {
    this.respond = e.withRespond;
  }
  /**
   * @param {object} data  json  responses
   * @return {object} html data
   */
  responsesData(data) {
    const responses = `<br> ## ${data.name}
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

  /**
   *
   * @param {object} val
   * @return {object} html data
   */
  mdOutput(val) {
    const self = this;
    let header = '';
    jQuery.each(val.request.header, function(i, sub) {
      header += `"${sub.key}" : "${sub.value}"<br>`;
    });


    let responses = '';


    if (self.respond) {
      jQuery.each(val.response, function(i, sub) {
        responses += self.responsesData(sub);
        console.log(sub);
      });
    }
    const md = `# ${val.name}
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
  /**
   *
   * @param {object} data
   */
  getJsonData(data) {
    const self = this;

    jQuery.each(data.item, function(i, val) {
      // console.log(i,val);
      if (val.request) {
        console.log(i, val.name, val);
        $('#md').append(self.mdOutput(val));
      } else {
        self.getJsonData(val);
      }
    });
  }
  /**
   *
   * @param {object} file
   */
  readJsonFile(file) {
    const self = this;
    const rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType('application/json');
    rawFile.open('GET', file, true);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == '200') {
        // callback(rawFile.responseText);
        const data = JSON.parse(rawFile.responseText);
        self.getJsonData(data);
      }
    };
    rawFile.send(null);
  }
}

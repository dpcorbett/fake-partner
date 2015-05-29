import request from 'superagent';

export default Class API {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;  
  }

  request() {
    return request({
      auth: {this.clientId,  this.clientSecret}
    });   
  }
}
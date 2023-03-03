export const Responses = {
  _200(data = {}) {
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  },

  _400(data = {}, statusCode = 400) {
    return {
      statusCode: statusCode,
      body: JSON.stringify(data),
    };
  },
};

export const request = ({ url, requestOptions }) => {
  requestOptions = {
    ...requestOptions,
    body:
      requestOptions.method === 'GET'
        ? null
        : JSON.stringify(requestOptions.body),
  };
  return fetch(url, requestOptions)
    .then((response) => {
      if (!response.ok) throw Error(statusText);
      return response.json();
    })
    .then((responseJson) => {
      return responseJson;
    })
    .catch((e) => {
      console.warn(e.message);
      return null;
    });
};

export const log = ({ event, status = '', message = '' }) => {
  console.log(
    `%c[Proton] ${event}${!status ? '' : ' | ' + status}\n`,
    'color:blue;font-weight:bold',
    message,
  );
};

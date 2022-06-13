const request = ({ url, requestOptions }) => {
  requestOptions = {
    ...requestOptions,
    body:
      requestOptions.method === "GET"
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

class Proton {
  // static
  static _GLUON_URL = "https://gluon.proton.ai";
  static _ENDPOINTS = {
    TRACK: "/track",
    PRODUCTS: "/product/recommendations",
  };
  static _MODEL_TYPES = {
    GENERAL: "",
    RECENT: "recent",
    REORDER: "periodic",
    BROUGHT: "bought",
    SIMILAR: "similar",
  };
  static _TRACK_EVENT_TYPES = {
    PRODUCT_VIEW: "seen",
    PRODUCT_CLICK: "click",
    ADD_TO_CART: "add_cart",
    PRODUCT_SEARCH: "search",
  };
  static _LOG({ event, status = "Start", message = "" }) {
    console.log(
      `%c[Proton] ${event} | ${status}\n`,
      "color:blue;font-weight:bold",
      message
    );
  }
  // initialize
  constructor({ company, apiKey, customerId, fetchCount = 12 }) {
    this.company = company;
    this.userId = `${company}_website`;
    this.apiKey = apiKey;
    this.customerId = customerId;
    this.baseURL = `${Proton._GLUON_URL}/${company}`;
    this.fetchCount = fetchCount;
    this.request = async ({ url, requestOptions, eventName = "" }) => {
      const body = {
        ...requestOptions.body,
        company,
        customer_id: customerId,
      };
      Proton._LOG({
        event: eventName,
        status: "PRESEND",
        message: body,
      });
      const res = await request({
        url,
        requestOptions: {
          ...requestOptions,
          body,
          headers: {
            "X-User-Id": this.userId,
            "X-Company": this.company,
            "X-Api-Key": this.apiKey,
          },
        },
      });
      res &&
        Proton._LOG({
          event: eventName,
          status: `${res.status_message}`,
          message: res.data,
        });
    };
    Proton._LOG({
      event: "Proton SDK initialization",
      status: "SUCCESS",
      message: this,
    });
  }
  get modelTypes() {
    return Proton._MODEL_TYPES;
  }
  get trackEventTypes() {
    return Proton._TRACK_EVENT_TYPES;
  }
  set updateCustomerId(newCustomerId) {
    const oldId = this.customerId;
    this.customerId = newCustomerId;
    Proton._LOG({
      event: "update customer id",
      status: "SUCCESS",
      message: {
        oldId,
        newId: this.customerId,
      },
    });
  }
  // methods
  getRecommendation({ type = "", productId = null }) {
    const paramObj = {
      customer_id: this.customerId,
      count: this.fetchCount,
      user_id: this.userId,
      product_id: productId,
    };
    this.request({
      url: `${this.baseURL}${
        Proton._ENDPOINTS.PRODUCTS
      }/${type}?${new URLSearchParams(paramObj).toString()}`,
      requestOptions: {
        method: "GET",
        body: paramObj, // use just for log
      },
      eventName: `Get recommendation - ${type}`,
    });
  }
  trackProduct(data) {
    this.request({
      url: `${this.baseURL}${Proton._ENDPOINTS.TRACK}`,
      requestOptions: {
        method: "POST",
        body: {
          ...data,
        },
      },
      eventName: `Track ${data.event}`,
    });
  }
  trackLogin(newCustomerId) {
    this.request({
      url: `${this.baseURL}${Proton._ENDPOINTS.TRACK}/login`,
      requestOptions: {
        method: "POST",
        body: {
          old_customer_id: this.customerId,
          new_customer_id: newCustomerId,
        },
      },
      eventName: `Track login`,
    });
  }
}

window.Proton = Proton;
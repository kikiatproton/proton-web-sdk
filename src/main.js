import { request, log } from './utils';
function Proton({ company, apiKey, customerId }) {
  // constance
  const _GLUON_URL = 'https://gluon.proton.ai';
  const _ENDPOINTS = {
    TRACK: '/track',
    PRODUCTS: '/product/recommendations',
  };
  const _MODEL_TYPES = {
    GENERAL: '',
    RECENT: 'recent',
    REORDER: 'periodic',
    BROUGHT: 'bought',
    SIMILAR: 'similar',
  };
  const _TRACK_EVENT_TYPES = {
    PRODUCT_VIEW: 'seen',
    PRODUCT_CLICK: 'click',
    ADD_TO_CART: 'add_cart',
    PRODUCT_SEARCH: 'search',
  };
  // const _DEFAULT_FETCH_COUNT = 12;
  // const _DEFAULT_CAROUSEL_PER_PAGE = {
  //   768: 2,
  //   1024: 3,
  //   1440: 4,
  // };
  // initialize
  this.company = company;
  this.userId = `${company}_website`;
  this.apiKey = apiKey;
  this.baseURL = `${_GLUON_URL}/${company}`;
  this.customerId = customerId;
  log({
    event: 'Proton SDK initialization',
    status: 'SUCCESS',
    message: this,
  });
  Object.defineProperties(Proton.prototype, {
    modelTypes: {
      get: function () {
        return _MODEL_TYPES;
      },
    },
    trackEventTypes: {
      get: function () {
        return _TRACK_EVENT_TYPES;
      },
    },
  });
  Proton.prototype.sendTrackFromQueue = () => {
    if (!window.trackQueue)
      return log({
        event: 'Send track from queue',
        status: 'FAIL',
        message: 'trackQueue not found',
      });
    if (!trackQueue.length)
      return log({
        event: 'Send track from queue',
        message: 'trackQueue empty',
      });
    log({
      event: 'Track queue task',
      status: 'PRE-EXECUTE',
      message: trackQueue,
    });
    trackQueue.forEach((task) => {
      if (task.event === 'login') {
        const { newId } = task;
        this.trackLogin(newId);
        this.updateCustomerId(newId);
      } else {
        this.trackProduct(task);
      }
      log({
        event: 'Track queue task',
        status: 'EXECUTED',
        message: task.event,
      });
    });
    trackQueue = [];
    log({
      event: 'Track queue task',
      status: 'CLEAR',
      message: 'Track queue cleared',
    });
  };
  Proton.prototype.doSend = async ({
    url,
    requestOptions,
    eventName = '',
    returnVal = (res) => res,
  }) => {
    const body = {
      ...requestOptions.body,
      company,
      customer_id: this.customerId,
    };
    log({
      event: eventName,
      status: 'PRESEND',
      message: body,
    });
    const res = await request({
      url,
      requestOptions: {
        ...requestOptions,
        body,
        headers: {
          'X-User-Id': this.userId,
          'X-Company': this.company,
          'X-Api-Key': this.apiKey,
        },
      },
    });
    res &&
      log({
        event: eventName,
        status: `${res.status_message}`,
        message: returnVal(res),
      });
    return returnVal(res) || null;
  };
  Proton.prototype.updateCustomerId = (newId) => {
    const oldId = this.customerId;
    this.customerId = newId;
    log({
      event: 'Update customer id',
      status: 'SUCCESS',
      message: { oldId, newId },
    });
  };
  Proton.prototype.trackProduct = (data) => {
    this.doSend({
      url: `${this.baseURL}${_ENDPOINTS.TRACK}`,
      requestOptions: {
        method: 'POST',
        body: data,
      },
      eventName: `Track ${data.event}`,
    });
  };
  Proton.prototype.trackLogin = (newCustomerId) => {
    this.doSend({
      url: `${this.baseURL}${_ENDPOINTS.TRACK}/login`,
      requestOptions: {
        method: 'POST',
        body: {
          old_customer_id: this.customerId,
          new_customer_id: newCustomerId,
        },
      },
      eventName: `Track login`,
    });
  };

  // async getRecommendation({ type = '', productId = null }) {
  //   const paramObj = {
  //     customer_id: this.customerId,
  //     count: this.fetchCount,
  //     user_id: this.userId,
  //     product_id: productId,
  //   };
  //   const res = await this.request({
  //     url: `${this.baseURL}${
  //       Proton._ENDPOINTS.PRODUCTS
  //     }/${type}?${new URLSearchParams(paramObj).toString()}`,
  //     requestOptions: {
  //       method: 'GET',
  //       body: paramObj, // use just for log
  //     },
  //     eventName: `Get recommendation - ${type}`,
  //     returnVal: (res) => res.data,
  //   });
  //   return res;
  // }
}
window.Proton = Proton;

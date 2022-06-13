# Proton Web SDK

A tool kit for browers to interacte with Proton API

## Reference

[Proton API](https://api.proton.ai/)

## Development

- Run `yarn`

- Create `config.dev.js` file under root directory:
```
const config = {
  company: "distributorX",
  apiKey: "someapikey",
  customerId: "1000",
};
```

- Run `yarn dev`

## Build

Run `yarn build`

## Initialization

Create a proton instance with config, and attach the instance to window object

```
var config = {
    company: "distributerX", 
    apiKey: "12345", 
    customerId:  "1000"
}
window.protonInstance = new Proton(config)
```

## API


- `modelTypes`

Values:
```
GENERAL: "",
RECENT: "recent",
REORDER: "periodic",
BROUGHT: "bought",
SIMILAR: "similar"
```

- `trackEventTypes`

Values:
```
PRODUCT_VIEW: "seen",
PRODUCT_CLICK: "click",
ADD_TO_CART: "add_cart",
PRODUCT_SEARCH: "search"
```


- `updateCustomerId`: update customer id

Example:
```
updateCustomerId("1000")
```


- `trackProduct`: track product related user behavior

Example:
```
trackProduct({ 
    event: trackEventTypes.PRODUCT_CLICK, 
    model: modelTypes.RECENT, 
    product_id: "1234"
})
```


- `trackLogin`: track user login behavior

Example:
```
trackLogin("1000")
```

- `getRecommendation`: get recommendation products

Example:
```
proton.getRecommendation({ type: modelTypes.SIMILAR, productId: "1-35043-34174" });
```
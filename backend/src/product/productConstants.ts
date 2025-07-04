export const PRODUCT_API_VERSION = '/v1.0.0';


  // Product Routes Mongo CRUD
export const PRODUCT_PREFIX = '/product';
export const PRODUCT_ROUTE = PRODUCT_API_VERSION + PRODUCT_PREFIX;

export const PRODUCT_ADD_PREFIX = '/add';
export const PRODUCT_ADD_PATH = PRODUCT_API_VERSION + PRODUCT_PREFIX + PRODUCT_ADD_PREFIX;

export const PRODUCT_GET_ALL_PREFIX = '/all';
export const PRODUCT_GET_ALL_PATH = PRODUCT_API_VERSION + PRODUCT_PREFIX + PRODUCT_GET_ALL_PREFIX;

export const PRODUCT_SEARCH_PREFIX = '/search';
export const PRODUCT_SEARCH_PATH = PRODUCT_API_VERSION + PRODUCT_PREFIX + PRODUCT_SEARCH_PREFIX;

export const PRODUCT_GET_ONE_PREFIX = '/:id';
export const PRODUCT_GET_ONE_PATH = PRODUCT_API_VERSION + PRODUCT_PREFIX + PRODUCT_GET_ONE_PREFIX;

export const PRODUCT_UPDATE_PREFIX = '/:id';
export const PRODUCT_UPDATE_PATH = PRODUCT_API_VERSION + PRODUCT_PREFIX + PRODUCT_UPDATE_PREFIX;

export const PRODUCT_DELETE_PREFIX = '/:id';
export const PRODUCT_DELETE_PATH = PRODUCT_API_VERSION + PRODUCT_PREFIX + PRODUCT_DELETE_PREFIX;


// Swagger tag for grouping
export const PRODUCT_TAG = 'Product';